import type { AttendantSessionAnalytics } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { queryKeys } from '@/config/queryKeys';
import { apiFetch } from '@/lib/api/client';
import { formatQueryString } from '@/utils/formatQueryString';

export type AttendantSessionAnalyticsQuery = {
  date: string;
  userId: string;
};

export async function getAttendantSessionAnalytics(
  query: AttendantSessionAnalyticsQuery,
): Promise<AttendantSessionAnalytics> {
  const queryString = formatQueryString(query);

  const response = await apiFetch<{ analytics: AttendantSessionAnalytics }>(
    ApiRoutes.sessions.attendantAnalytics(queryString),
  );
  return response.analytics;
}

export const useAttendantSessionAnalytics = (query: AttendantSessionAnalyticsQuery) => {
  return useQuery({
    queryKey: queryKeys.sessions.analytics(),
    queryFn: () => getAttendantSessionAnalytics(query),
  });
};
