import type { PermissionKey } from '@parkguard/authorization';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type AccessGuardProps = {
  permission: readonly PermissionKey[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function AccessGuard({ permission, children, fallback = null }: AccessGuardProps) {
  const auth = useAuth();
  return auth.hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}
