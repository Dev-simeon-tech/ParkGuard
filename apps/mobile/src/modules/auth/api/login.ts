import type { LoginBody } from '@parkguard/schemas';
import type { AuthResponse } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { apiFetch } from '@/lib/api/client';

function login(credentials: Pick<LoginBody, 'email' | 'password'>): Promise<AuthResponse> {
  const body: LoginBody = { ...credentials, scope: 'mobile' };
  return apiFetch<AuthResponse>(ApiRoutes.auth.login, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function useLogin() {
  return useMutation({ mutationFn: login });
}
