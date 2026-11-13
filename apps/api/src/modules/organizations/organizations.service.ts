import { randomBytes } from 'node:crypto';
import type { AcceptInviteBody, UpdateEmployeeBody } from '@parkguard/schemas';
import type { OrganizationMember, RoleSummary } from '@parkguard/types';
import { In } from 'typeorm';
import { BadRequestException } from '@/common/exceptions';
import { serializeUser } from '@/common/utils/serialize-user';
import { envConfig } from '@/config';
import { AppDataSource } from '@/db';
import {
  BranchEntity,
  EmployeeBranchEntity,
  OrganizationEntity,
  OrganizationUserEntity,
  RoleEntity,
  TokenType,
  UserEntity,
} from '@/db/entities';
import { hashPassword } from '@/lib/password';
import { consumeToken, generateToken, validateToken } from '@/lib/token';
import { NotificationService } from '@/modules/notifications';
import { EmailNotificationType, NotificationChannel } from '@/modules/notifications/types';
import { OrganizationMessages } from './organizations.messages';
import type { InviteMemberInput, InviteTokenInfo } from './types';

export class OrganizationsService {
  private readonly notificationService = new NotificationService();

  async inviteMember(input: InviteMemberInput): Promise<void> {
    const existingUser = await UserEntity.findOneBy({ email: input.email });
    if (existingUser) {
      throw new BadRequestException(OrganizationMessages.EMAIL_ALREADY_REGISTERED);
    }

    const role = await RoleEntity.findOneBy({ id: input.roleId });
    if (!role) {
      throw new BadRequestException(OrganizationMessages.INVALID_ROLE);
    }

    const organization = await OrganizationEntity.findOneByOrFail({ id: input.organizationId });

    const branches = input.branchIds?.length
      ? await this.validateBranches(input.organizationId, input.branchIds)
      : [];

    const unusablePassword = await hashPassword(randomBytes(32).toString('hex'));

    const user = await AppDataSource.transaction(async (manager) => {
      const newUser = manager.create(UserEntity, {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: unusablePassword,
        phoneNumber: input.phoneNumber ?? null,
        emailVerifiedAt: null,
      });
      await manager.save(newUser);

      const organizationUser = manager.create(OrganizationUserEntity, {
        organization,
        user: newUser,
        role,
        acceptedAt: null,
      });
      await manager.save(organizationUser);

      for (const branch of branches) {
        const employeeBranch = manager.create(EmployeeBranchEntity, {
          organizationUser,
          branch,
        });
        await manager.save(employeeBranch);
      }

      return newUser;
    });

    const { token } = await generateToken(TokenType.INVITE, {
      userId: user.id,
      email: user.email,
    });
    const inviteUrl = `${envConfig.clientUrls.customerPortal}/accept-invite?token=${token}`;

    await this.notificationService.sendNotification(NotificationChannel.EMAIL, {
      type: EmailNotificationType.INVITE,
      email: user.email,
      organizationName: organization.name,
      inviteUrl,
    });
  }

  async verifyInviteToken(rawToken: string): Promise<InviteTokenInfo> {
    const tokenEntity = await validateToken(rawToken, TokenType.INVITE);
    if (!tokenEntity.user) {
      throw new BadRequestException(OrganizationMessages.INVALID_INVITE_TOKEN);
    }

    const organizationUser = await OrganizationUserEntity.findOne({
      where: { user: { id: tokenEntity.user.id } },
      relations: { organization: true },
    });
    if (!organizationUser) {
      throw new BadRequestException(OrganizationMessages.INVALID_INVITE_TOKEN);
    }

    return {
      email: tokenEntity.user.email,
      organizationName: organizationUser.organization.name,
    };
  }

  async acceptInvite(input: AcceptInviteBody): Promise<void> {
    const tokenEntity = await validateToken(input.token, TokenType.INVITE);
    if (!tokenEntity.user) {
      throw new BadRequestException(OrganizationMessages.INVALID_INVITE_TOKEN);
    }

    const organizationUser = await OrganizationUserEntity.findOneBy({
      user: { id: tokenEntity.user.id },
    });
    if (!organizationUser) {
      throw new BadRequestException(OrganizationMessages.INVALID_INVITE_TOKEN);
    }

    const hashedPassword = await hashPassword(input.password);

    await AppDataSource.transaction(async (manager) => {
      const invitedUser = tokenEntity.user!;
      invitedUser.password = hashedPassword;
      invitedUser.emailVerifiedAt = new Date();
      await manager.save(invitedUser);

      organizationUser.acceptedAt = new Date();
      await manager.save(organizationUser);
    });

    await consumeToken(tokenEntity);
  }

  async listRoles(): Promise<RoleSummary[]> {
    const roles = await RoleEntity.find({ order: { name: 'ASC' } });
    return roles.map((role) => ({ id: role.id, name: role.name }));
  }

  async listEmployees(organizationId: string): Promise<OrganizationMember[]> {
    const memberships = await OrganizationUserEntity.find({
      where: { organization: { id: organizationId } },
      relations: { user: true, role: true },
      order: { createdAt: 'ASC' },
    });

    const employeeBranches = memberships.length
      ? await EmployeeBranchEntity.find({
          where: { organizationUser: { id: In(memberships.map((membership) => membership.id)) } },
          relations: { branch: true, organizationUser: true },
        })
      : [];
    const branchesByMembershipId = new Map<string, { id: string; name: string }[]>();
    for (const employeeBranch of employeeBranches) {
      const membershipId = employeeBranch.organizationUser.id;
      const list = branchesByMembershipId.get(membershipId) ?? [];
      list.push({ id: employeeBranch.branch.id, name: employeeBranch.branch.name });
      branchesByMembershipId.set(membershipId, list);
    }

    return memberships.map((membership) => ({
      id: membership.id,
      user: serializeUser(membership.user),
      role: membership.role.name,
      branches: branchesByMembershipId.get(membership.id) ?? [],
      acceptedAt: membership.acceptedAt ? membership.acceptedAt.toISOString() : null,
      disabledAt: membership.disabledAt ? membership.disabledAt.toISOString() : null,
      createdAt: membership.createdAt.toISOString(),
    }));
  }

  async updateEmployee(
    organizationId: string,
    membershipId: string,
    input: UpdateEmployeeBody,
  ): Promise<void> {
    const membership = await this.findMembership(organizationId, membershipId);

    let role: RoleEntity | undefined;
    if (input.roleId !== undefined) {
      const foundRole = await RoleEntity.findOneBy({ id: input.roleId });
      if (!foundRole) {
        throw new BadRequestException(OrganizationMessages.INVALID_ROLE);
      }
      role = foundRole;
    }

    const branches =
      input.branchIds !== undefined && input.branchIds.length
        ? await this.validateBranches(organizationId, input.branchIds)
        : [];

    await AppDataSource.transaction(async (manager) => {
      if (input.firstName !== undefined) {
        membership.user.firstName = input.firstName;
      }
      if (input.lastName !== undefined) {
        membership.user.lastName = input.lastName;
      }
      if (input.phoneNumber !== undefined) {
        membership.user.phoneNumber = input.phoneNumber;
      }
      await manager.save(membership.user);

      if (role) {
        membership.role = role;
        await manager.save(membership);
      }

      if (input.branchIds !== undefined) {
        const existing = await manager.find(EmployeeBranchEntity, {
          where: { organizationUser: { id: membership.id } },
          relations: { branch: true },
        });
        const existingByBranchId = new Map(existing.map((eb) => [eb.branch.id, eb]));
        const desiredIds = new Set(branches.map((branch) => branch.id));

        for (const branch of branches) {
          if (existingByBranchId.has(branch.id)) {
            continue;
          }
          const employeeBranch = manager.create(EmployeeBranchEntity, {
            organizationUser: membership,
            branch,
          });
          await manager.save(employeeBranch);
        }

        for (const [branchId, employeeBranch] of existingByBranchId) {
          if (!desiredIds.has(branchId)) {
            await manager.remove(employeeBranch);
          }
        }
      }
    });
  }

  async disableEmployee(
    organizationId: string,
    membershipId: string,
    requestingUserId: string,
  ): Promise<void> {
    const membership = await this.findMembership(organizationId, membershipId);
    if (membership.user.id === requestingUserId) {
      throw new BadRequestException(OrganizationMessages.CANNOT_DISABLE_SELF);
    }

    membership.disabledAt = new Date();
    await membership.save();
  }

  async enableEmployee(organizationId: string, membershipId: string): Promise<void> {
    const membership = await this.findMembership(organizationId, membershipId);
    membership.disabledAt = null;
    await membership.save();
  }

  async removeEmployee(
    organizationId: string,
    membershipId: string,
    requestingUserId: string,
  ): Promise<void> {
    const membership = await this.findMembership(organizationId, membershipId);
    if (membership.user.id === requestingUserId) {
      throw new BadRequestException(OrganizationMessages.CANNOT_REMOVE_SELF);
    }

    await membership.remove();
  }

  private async findMembership(
    organizationId: string,
    membershipId: string,
  ): Promise<OrganizationUserEntity> {
    const membership = await OrganizationUserEntity.findOne({
      where: { id: membershipId, organization: { id: organizationId } },
      relations: { user: true, role: true },
    });
    if (!membership) {
      throw new BadRequestException(OrganizationMessages.EMPLOYEE_NOT_FOUND);
    }
    return membership;
  }

  private async validateBranches(
    organizationId: string,
    branchIds: string[],
  ): Promise<BranchEntity[]> {
    const branches = await BranchEntity.find({
      where: { id: In(branchIds), organization: { id: organizationId } },
    });
    if (branches.length !== branchIds.length) {
      throw new BadRequestException(OrganizationMessages.BRANCHES_NOT_FOUND);
    }
    return branches;
  }
}
