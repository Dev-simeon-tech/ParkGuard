import type { AuthResponse } from '@parkguard/types';
import { createContext, useContext, useEffect, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { queryKeys } from '@/config/queryKeys';
import { setSessionHandlers } from '@/lib/api/client';
import { setAccessToken } from '@/lib/api/token-store';
import { queryClient } from '@/lib/query-client';
import { useRefreshSession, refreshSession } from '../api/refresh';
import { clearSession } from '../utils';

export type AuthContextValue = {
  branches: AuthResponse['branches'];
  user: AuthResponse['user'] | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { data, isLoading } = useRefreshSession();

  useEffect(() => {
    setAccessToken(data?.accessToken ?? null);
  }, [data?.accessToken]);

  useEffect(() => {
    setSessionHandlers({
      refresh: refreshSession,
      onRefreshed: (session) => {
        queryClient.setQueryData(queryKeys.auth.session(), session);
      },
      onExpired: () => {
        void clearSession();
      },
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      branches: data?.branches ?? [],
      user: data?.user ?? null,
      isLoggedIn: Boolean(data?.accessToken),
      isLoading,
    }),
    [data, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
