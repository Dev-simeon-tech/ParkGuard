import type { AttendantSessionAnalytics } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { formatQueryString } from '@/utils/formatQueryString';

type AttendantActivitiesQuery = {
  date: string;
  userId: string;
};

const getEmployeeActivities = async (
  query: AttendantActivitiesQuery,
): Promise<AttendantSessionAnalytics> => {
  const formatedQuery = formatQueryString(query);
  const response = await api.get<{ analytics: AttendantSessionAnalytics }>(
    ApiRoutes.organizations.employeeActivities(formatedQuery),
  );
  return response.data.analytics;
};

export const useGetEmployeeActivities = (query: AttendantActivitiesQuery) => {
  return useQuery({
    queryKey: queryKeys.employees.activities(),
    queryFn: () => getEmployeeActivities(query),
  });
};
