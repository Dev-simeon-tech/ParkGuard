import type { ParkingSessionSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { apiFetch } from '@/lib/api/client';

export async function getSession(sessionId: string): Promise<ParkingSessionSummary> {
  const response = await apiFetch<{ session: ParkingSessionSummary }>(
    ApiRoutes.sessions.get(sessionId),
  );
  return response.session;
}

export const useGetSession = (id: string) => {
  return useQuery({
    queryKey: queryKeys.sessions.get(id),
    queryFn: () => getSession(id),
  });
};
