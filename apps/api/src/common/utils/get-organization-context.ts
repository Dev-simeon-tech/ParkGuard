import type { PermissionKey } from '@parkguard/authorization';
import { OrganizationUserEntity, RolePermissionEntity } from '@/db/entities';

export type OrganizationContext = {
  organization: { id: string; name: string };
  role: string;
  permissions: PermissionKey[];
};

export async function getOrganizationContext(userId: string): Promise<OrganizationContext | null> {
  const membership = await OrganizationUserEntity.findOne({
    where: { user: { id: userId } },
    relations: { role: true, organization: true },
  });
  if (!membership) {
    return null;
  }

  if (membership.disabledAt) {
    return {
      organization: { id: membership.organization.id, name: membership.organization.name },
      role: membership.role.name,
      permissions: [],
    };
  }

  const rolePermissions = await RolePermissionEntity.find({
    where: { role: { id: membership.role.id } },
    relations: { permission: true },
  });

  return {
    organization: { id: membership.organization.id, name: membership.organization.name },
    role: membership.role.name,
    permissions: rolePermissions.map((rp) => rp.permission.name),
  };
}
