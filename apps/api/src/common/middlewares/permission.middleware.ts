import type { PermissionKey } from '@parkguard/authorization';
import { hasPermission } from '@parkguard/authorization';
import type { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '@/common/exceptions';
import { RolePermissionEntity } from '@/db/entities';

export function requirePermission(permissions: readonly PermissionKey[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const membership = req.organizationUser;
    if (!membership) {
      next(new ForbiddenException('You do not belong to an organization'));
      return;
    }

    const grantedPermissions = await RolePermissionEntity.find({
      where: { role: { id: membership.role.id } },
      relations: { permission: true },
    });
    const grantedNames = grantedPermissions.map((rolePermission) => rolePermission.permission.name);

    if (!hasPermission(grantedNames, permissions)) {
      next(new ForbiddenException('You do not have permission to perform this action'));
      return;
    }

    next();
  };
}
