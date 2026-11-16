import type { AuthResponse } from '@parkguard/types';
import { queryKeys } from '@/config/queryKeys';
import { setAccessToken } from '@/lib/axios/token-store';
import { queryClient } from '@/lib/react-query';

export function applySession(data: AuthResponse): void {
  setAccessToken(data.accessToken);
  queryClient.setQueryData(queryKeys.auth.session(), data);
}

export function clearSession(): void {
  setAccessToken(null);
  queryClient.setQueryData(queryKeys.auth.session(), null);
}
