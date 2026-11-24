import type { SessionRevenueAnalytics } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

export async function getRevenueAnalytics(date: string): Promise<SessionRevenueAnalytics> {
  const response = await api.get<{ analytics: SessionRevenueAnalytics }>(
    ApiRoutes.parkingLog.revenue(date),
  );
  return response.data.analytics;
}

export const useRevenueAnalytics = (date: string) => {
  return useQuery({
    queryKey: queryKeys.parkingLog.revenue(date),
    queryFn: () => getRevenueAnalytics(date),
  });
};
