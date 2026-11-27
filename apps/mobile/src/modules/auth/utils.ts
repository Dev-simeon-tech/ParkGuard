import type { AuthResponse } from '@parkguard/types';
import { queryKeys } from '@/config/queryKeys';
import { setRefreshToken } from '@/lib/api/refresh-token-store';
import { setAccessToken } from '@/lib/api/token-store';
import { queryClient } from '@/lib/query-client';

export async function applySession(data: AuthResponse): Promise<void> {
  await setRefreshToken(data.refreshToken ?? null);
  setAccessToken(data.accessToken);
  queryClient.setQueryData(queryKeys.auth.session(), data);
}

export async function clearSession(): Promise<void> {
  await setRefreshToken(null);
  setAccessToken(null);
  queryClient.setQueryData(queryKeys.auth.session(), null);
}
