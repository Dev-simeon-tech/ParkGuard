import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { apiFetch } from '@/lib/api/client';

function logout(body: { refreshToken: string | null }): Promise<void> {
  return apiFetch<void>(ApiRoutes.auth.logout, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}
