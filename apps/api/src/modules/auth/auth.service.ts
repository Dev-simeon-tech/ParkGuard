import { DefaultRoles, hasPermission, PermissionSets } from '@parkguard/authorization';
import type { LoginBody, RegisterBody, ResetPasswordBody } from '@parkguard/schemas';
import { BadRequestException, ForbiddenException } from '@/common/exceptions';
import type { AuthResult } from '@/common/types';
import { getOrganizationContext } from '@/common/utils/get-organization-context';
import { envConfig } from '@/config';
import { AppDataSource } from '@/db';
import {
  OrganizationEntity,
  OrganizationUserEntity,
  RoleEntity,
  TokenEntity,
  TokenType,
  UserEntity,
} from '@/db/entities';
import { signAccessToken } from '@/lib/jwt';
import { comparePassword, hashPassword } from '@/lib/password';
import {
  consumeToken,
  deleteToken,
  deleteTokensForUser,
  generateToken,
  validateToken,
} from '@/lib/token';
import { NotificationService } from '@/modules/notifications';
import { EmailNotificationType, NotificationChannel } from '@/modules/notifications/types';
import { AuthMessages } from './auth.messages';

export class AuthService {
  private readonly notificationService = new NotificationService();

  async register(input: RegisterBody): Promise<AuthResult> {
    const existingUser = await UserEntity.findOneBy({ email: input.email });
    if (existingUser) {
      throw new BadRequestException(AuthMessages.EMAIL_ALREADY_REGISTERED);
    }

    const adminRole = await RoleEntity.findOneByOrFail({ name: DefaultRoles.admin.name });
    const hashedPassword = await hashPassword(input.password);

    const user = await AppDataSource.transaction(async (manager) => {
      const organization = manager.create(OrganizationEntity, { name: input.businessName });
      await manager.save(organization);

      const newUser = manager.create(UserEntity, {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
        phoneNumber: input.phoneNumber ?? null,
      });
      await manager.save(newUser);

      const organizationUser = manager.create(OrganizationUserEntity, {
        organization,
        user: newUser,
        role: adminRole,
        acceptedAt: new Date(),
      });
      await manager.save(organizationUser);

      return newUser;
    });

    await this.sendVerificationEmail(user);

    return this.issueAuthResult(user);
  }

  async login(input: LoginBody): Promise<AuthResult> {
    const user = await UserEntity.findOneBy({ email: input.email });
    if (!user) {
      throw new BadRequestException(AuthMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(AuthMessages.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new ForbiddenException(AuthMessages.ACCOUNT_DISABLED);
    }

    const context = await getOrganizationContext(user.id);
    if (input.scope === 'mobile') {
      if (
        !context ||
        context.role === DefaultRoles.admin.name ||
        context.role === DefaultRoles.financialAuditor.name ||
        !hasPermission(context.permissions, PermissionSets.sessions.MANAGE)
      ) {
        throw new ForbiddenException(AuthMessages.SCOPE_NOT_ALLOWED);
      }
    } else if (context?.role === DefaultRoles.attendant.name) {
      throw new ForbiddenException(AuthMessages.SCOPE_NOT_ALLOWED);
    }

    return this.issueAuthResult(user);
  }

  async refreshAccessToken(
    rawRefreshToken: string | undefined,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    if (!rawRefreshToken) {
      throw new BadRequestException(AuthMessages.REFRESH_TOKEN_REQUIRED);
    }

    const tokenEntity = await validateToken(rawRefreshToken, TokenType.REFRESH);
    if (!tokenEntity.user) {
      throw new BadRequestException(AuthMessages.INVALID_REFRESH_TOKEN);
    }

    const accessToken = signAccessToken({
      userId: tokenEntity.user.id,
      email: tokenEntity.user.email,
    });

    return { accessToken, user: tokenEntity.user };
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const [key] = rawRefreshToken.split('.');
    if (!key) {
      return;
    }

    const tokenEntity = await TokenEntity.findOneBy({ key, type: TokenType.REFRESH });
    if (tokenEntity) {
      await deleteToken(tokenEntity);
    }
  }

  async verifyEmail(rawToken: string): Promise<void> {
    const tokenEntity = await validateToken(rawToken, TokenType.EMAIL_VERIFICATION);
    if (!tokenEntity.user) {
      throw new BadRequestException(AuthMessages.INVALID_VERIFICATION_TOKEN);
    }

    tokenEntity.user.emailVerifiedAt = new Date();
    await tokenEntity.user.save();
    await consumeToken(tokenEntity);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await UserEntity.findOneBy({ email });
    if (!user || user.emailVerifiedAt) {
      return;
    }

    await this.sendVerificationEmail(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await UserEntity.findOneBy({ email });
    if (!user) {
      return;
    }

    const { token } = await generateToken(TokenType.PASSWORD_RESET, {
      userId: user.id,
      email: user.email,
    });

    const resetUrl = `${envConfig.clientUrls.customerPortal}/reset-password?token=${token}`;

    await this.notificationService.sendNotification(NotificationChannel.EMAIL, {
      type: EmailNotificationType.PASSWORD_RESET,
      email: user.email,
      resetUrl,
    });
  }

  async verifyPasswordResetToken(rawToken: string): Promise<{ email: string }> {
    const tokenEntity = await validateToken(rawToken, TokenType.PASSWORD_RESET);
    if (!tokenEntity.user) {
      throw new BadRequestException(AuthMessages.INVALID_PASSWORD_RESET_TOKEN);
    }

    return { email: tokenEntity.user.email };
  }

  async resetPassword(input: ResetPasswordBody): Promise<void> {
    const tokenEntity = await validateToken(input.token, TokenType.PASSWORD_RESET);
    if (!tokenEntity.user) {
      throw new BadRequestException(AuthMessages.INVALID_PASSWORD_RESET_TOKEN);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = tokenEntity.user;
    user.password = hashedPassword;
    await user.save();

    await consumeToken(tokenEntity);
    await deleteTokensForUser(user.id, TokenType.REFRESH);
  }

  private async sendVerificationEmail(user: UserEntity): Promise<void> {
    const { token } = await generateToken(TokenType.EMAIL_VERIFICATION, {
      userId: user.id,
      email: user.email,
    });
    const verificationUrl = `${envConfig.clientUrls.customerPortal}/verify-email?token=${token}`;

    await this.notificationService.sendNotification(NotificationChannel.EMAIL, {
      type: EmailNotificationType.VERIFICATION,
      email: user.email,
      verificationUrl,
    });
  }

  private async issueAuthResult(user: UserEntity): Promise<AuthResult> {
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const { token: refreshToken, expiresAt: refreshTokenExpiresAt } = await generateToken(
      TokenType.REFRESH,
      { userId: user.id },
    );

    return { user, accessToken, refreshToken, refreshTokenExpiresAt };
  }
}
