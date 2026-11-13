import type { PermissionKey } from '@parkguard/authorization';
import { DefaultRoles, Permissions } from '@parkguard/authorization';
import { Logger } from '@/common/utils/logger';
import { PermissionEntity, RoleEntity, RolePermissionEntity } from '@/db/entities';

const logger = new Logger('RoleSync');

const rolePermissionMap: Record<string, PermissionKey[]> = {
  [DefaultRoles.admin.name]: [
    ...Object.values(Permissions.organization),
    ...Object.values(Permissions.branches),
    Permissions.revenue.MANAGE,
    Permissions.sessions.VIEW,
  ],
  [DefaultRoles.financialAuditor.name]: [Permissions.revenue.MANAGE],
  [DefaultRoles.attendant.name]: [Permissions.sessions.MANAGE],
};

async function syncRoles(): Promise<Map<string, RoleEntity>> {
  const roles = new Map<string, RoleEntity>();
  for (const { name } of Object.values(DefaultRoles)) {
    let role = await RoleEntity.findOneBy({ name });
    if (!role) {
      role = await RoleEntity.create({ name }).save();
      logger.info(`Created role: ${name}`);
    }
    roles.set(name, role);
  }
  return roles;
}

async function syncPermissions(): Promise<Map<string, PermissionEntity>> {
  const permissionNames = Object.values(Permissions).flatMap((group) => Object.values(group));
  const permissions = new Map<string, PermissionEntity>();
  for (const name of permissionNames) {
    let permission = await PermissionEntity.findOneBy({ name });
    if (!permission) {
      permission = await PermissionEntity.create({ name }).save();
      logger.info(`Created permission: ${name}`);
    }
    permissions.set(name, permission);
  }
  return permissions;
}

async function syncRolePermissions(
  roles: Map<string, RoleEntity>,
  permissions: Map<string, PermissionEntity>,
): Promise<void> {
  for (const [roleName, permissionNames] of Object.entries(rolePermissionMap)) {
    const role = roles.get(roleName);
    if (!role) {
      continue;
    }

    const existing = await RolePermissionEntity.find({
      where: { role: { id: role.id } },
      relations: { permission: true },
    });
    const existingByName = new Map(existing.map((rp) => [rp.permission.name, rp]));
    const desiredNames = new Set(permissionNames);

    for (const name of permissionNames) {
      if (existingByName.has(name)) {
        continue;
      }
      const permission = permissions.get(name);
      if (!permission) {
        continue;
      }
      await RolePermissionEntity.create({ role, permission }).save();
      logger.info(`Granted ${name} to role: ${roleName}`);
    }

    for (const [name, rolePermission] of existingByName) {
      if (!desiredNames.has(name)) {
        await rolePermission.remove();
        logger.info(`Revoked ${name} from role: ${roleName}`);
      }
    }
  }
}

export async function syncRolesAndPermissions(): Promise<void> {
  const roles = await syncRoles();
  const permissions = await syncPermissions();
  await syncRolePermissions(roles, permissions);
  logger.info('Role/permission sync complete');
}
