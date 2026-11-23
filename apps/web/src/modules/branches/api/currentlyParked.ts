import type { ListSessionsQuery } from '@parkguard/schemas';
import type { ParkingSessionSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { formatQueryString } from '@/utils/formatQueryString';

export type ListParkingLogResponse = {
  sessions: ParkingSessionSummary[];
  total: number;
  page: number;
  limit: number;
};

export async function listCurrentlyParked(
  query: ListSessionsQuery,
): Promise<ListParkingLogResponse> {
  const queryString = formatQueryString(query);

  const response = await api.get<ListParkingLogResponse>(ApiRoutes.parkingLog.list(queryString));
  return response.data;
}

export const useListCurrentlyParked = (query: ListSessionsQuery) => {
  return useQuery({
    queryKey: queryKeys.parkingLog.list(query),
    queryFn: () => listCurrentlyParked(query),
  });
};
