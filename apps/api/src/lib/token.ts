import { randomBytes, randomUUID } from 'node:crypto';
import { BadRequestException } from '@/common/exceptions';
import { TokenEntity, TokenType, UserEntity } from '@/db/entities';
import { comparePassword, hashPassword } from './password';

const TOKEN_EXPIRY_MS: Record<TokenType, number> = {
  [TokenType.REFRESH]: 30 * 24 * 60 * 60 * 1000,
  [TokenType.EMAIL_VERIFICATION]: 24 * 60 * 60 * 1000,
  [TokenType.PASSWORD_RESET]: 60 * 60 * 1000,
  [TokenType.INVITE]: 7 * 24 * 60 * 60 * 1000,
};

export type GenerateTokenOptions = {
  userId?: string;
  email?: string;
  metadata?: Record<string, unknown>;
};

export type GeneratedToken = {
  token: string;
  expiresAt: Date;
  entity: TokenEntity;
};

export async function generateToken(
  type: TokenType,
  options: GenerateTokenOptions = {},
): Promise<GeneratedToken> {
  const key = randomUUID();
  const secret = randomBytes(32).toString('hex');
  const hashedSecret = await hashPassword(secret);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS[type]);

  const entity = TokenEntity.create({
    key,
    token: hashedSecret,
    type,
    user: options.userId ? ({ id: options.userId } as UserEntity) : null,
    email: options.email ?? null,
    metadata: options.metadata ?? null,
    expiresAt,
  });
  await entity.save();

  return { token: `${key}.${secret}`, expiresAt, entity };
}

export async function validateToken(rawToken: string, type: TokenType): Promise<TokenEntity> {
  const [key, secret] = rawToken.split('.');
  if (!key || !secret) {
    throw new BadRequestException('Invalid token');
  }

  const entity = await TokenEntity.findOne({ where: { key, type }, relations: { user: true } });
  if (!entity) {
    throw new BadRequestException('Invalid token');
  }

  const isValid = await comparePassword(secret, entity.token);
  if (!isValid || entity.expiresAt < new Date()) {
    throw new BadRequestException('Invalid or expired token');
  }

  if (type !== TokenType.REFRESH && entity.usedAt) {
    throw new BadRequestException('Token already used');
  }

  return entity;
}

export async function consumeToken(entity: TokenEntity): Promise<void> {
  entity.usedAt = new Date();
  await entity.save();
}

export async function deleteToken(entity: TokenEntity): Promise<void> {
  await entity.remove();
}

export async function deleteTokensForUser(userId: string, type: TokenType): Promise<void> {
  await TokenEntity.delete({ user: { id: userId }, type });
}
