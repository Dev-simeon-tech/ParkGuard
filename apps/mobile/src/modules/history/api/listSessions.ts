import type { ListSessionsQuery } from '@parkguard/schemas';
import type { ParkingSessionSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { apiFetch } from '@/lib/api/client';
import { formatQueryString } from '@/utils/formatQueryString';

export type ListSessionsResponse = {
  sessions: ParkingSessionSummary[];
  total: number;
  page: number;
  limit: number;
};

export async function listSession(query: ListSessionsQuery): Promise<ListSessionsResponse> {
  const queryString = formatQueryString(query);

  const response = await apiFetch<ListSessionsResponse>(ApiRoutes.sessions.list(queryString));
  return response;
}

export const useListSession = (query: ListSessionsQuery) => {
  return useQuery({
    queryKey: queryKeys.sessions.list(query),
    queryFn: () => listSession(query),
  });
};
