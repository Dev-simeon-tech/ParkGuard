import { SessionAnalytics } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

const getSessionsAnalytics = async (date: string): Promise<SessionAnalytics> => {
  const response = await api.get<{ analytics: SessionAnalytics }>(
    ApiRoutes.parkingLog.analytics(date),
  );
  return response.data.analytics;
};

export const useSessionsAnalytics = (date: string) => {
  return useQuery({
    queryKey: queryKeys.parkingLog.analytics(date),
    queryFn: () => getSessionsAnalytics(date),
  });
};
