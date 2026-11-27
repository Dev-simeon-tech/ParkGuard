import type { CloseSessionBody } from '@parkguard/schemas';
import type { ParkingSessionSummary } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { apiFetch } from '@/lib/api/client';
import { queryClient } from '@/lib/query-client';

type CloseSessionProps = {
  input: CloseSessionBody;
  sessionId: string;
};

export function closeSession({
  input,
  sessionId,
}: CloseSessionProps): Promise<{ session: ParkingSessionSummary }> {
  return apiFetch(ApiRoutes.sessions.close(sessionId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export const useCloseSession = () => {
  return useMutation({
    mutationFn: closeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.analytics() });
    },
  });
};
