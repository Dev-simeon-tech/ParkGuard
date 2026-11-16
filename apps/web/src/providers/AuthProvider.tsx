import type { PermissionKey } from '@parkguard/authorization';
import { hasPermission as checkPermission } from '@parkguard/authorization';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/Spinner';
import { AuthContext } from '@/context/auth.context';
import { setAccessToken } from '@/lib/axios/token-store';
import { useRefreshSession } from '@/modules/auth/api/refresh';

export function AuthProvider({ children }: PropsWithChildren) {
  const { data, isLoading } = useRefreshSession();

  useEffect(() => {
    setAccessToken(data?.accessToken ?? null);
  }, [data?.accessToken]);

  const value = useMemo(() => {
    const permissions = data?.permissions ?? [];
    return {
      branches: data?.branches ?? [],
      user: data?.user ?? null,
      organization: data?.organization ?? null,
      permissions,
      isAuthenticated: Boolean(data?.accessToken),
      isLoading,
      hasPermission: (permission: readonly PermissionKey[]) =>
        checkPermission(permissions, permission),
    };
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
