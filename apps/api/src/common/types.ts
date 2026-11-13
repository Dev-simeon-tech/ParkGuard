import type { UserEntity } from '@/db/entities';

export type AuthResult = {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};
