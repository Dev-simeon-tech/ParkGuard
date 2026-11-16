import type { OrganizationUserEntity } from '@/db/entities';
import type { AccessTokenPayload } from '@/lib/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      organizationUser?: OrganizationUserEntity;
    }
  }
}

export {};
