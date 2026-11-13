import type { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnauthorizedException } from '@/common/exceptions';
import { OrganizationUserEntity } from '@/db/entities';

export async function tenantGuard(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new UnauthorizedException('Not authenticated'));
    return;
  }

  const membership = await OrganizationUserEntity.findOne({
    where: { user: { id: req.user.userId } },
    relations: { role: true, organization: true },
  });

  if (!membership) {
    next(new ForbiddenException('You do not belong to an organization'));
    return;
  }

  if (membership.disabledAt) {
    next(new ForbiddenException('Your access to this organization has been disabled'));
    return;
  }

  req.organizationUser = membership;
  next();
}
