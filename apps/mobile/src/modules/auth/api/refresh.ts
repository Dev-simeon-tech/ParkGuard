import type { AuthResponse } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { ApiError } from '@/lib/api/client';
import { getRefreshToken, setRefreshToken } from '@/lib/api/refresh-token-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function refreshSession(): Promise<AuthResponse> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, 'No session');
  }

  const response = await fetch(`${API_URL}${ApiRoutes.auth.refresh}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    await setRefreshToken(null);
    throw new ApiError(response.status, body?.error?.message ?? 'Session expired');
  }

  return response.json() as Promise<AuthResponse>;
}

export function useRefreshSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: refreshSession,
    retry: false,
    staleTime: Infinity,
  });
}
