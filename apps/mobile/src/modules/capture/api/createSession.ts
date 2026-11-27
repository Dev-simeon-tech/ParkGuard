import type { CreateSessionBody } from '@parkguard/schemas';
import type { ParkingSessionSummary } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { apiFetch } from '@/lib/api/client';
import { queryClient } from '@/lib/query-client';

export function createSession(input: CreateSessionBody): Promise<ParkingSessionSummary> {
  return apiFetch(ApiRoutes.sessions.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export const useCreateSession = () => {
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.analytics() });
    },
  });
};
