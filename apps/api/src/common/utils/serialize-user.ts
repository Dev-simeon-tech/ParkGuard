import type { PublicUser } from '@parkguard/types';
import type { UserEntity } from '@/db/entities';

export function serializeUser(user: UserEntity): Omit<PublicUser, 'role'> {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}
