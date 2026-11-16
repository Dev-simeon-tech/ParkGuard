import type { PermissionKey } from './types';

export function hasPermission(granted: readonly string[], required: readonly PermissionKey[]): boolean {
  return required.some((permission) => granted.includes(permission));
}
