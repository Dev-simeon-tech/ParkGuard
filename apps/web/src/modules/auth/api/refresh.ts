import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { refreshSession } from '@/lib/axios/refresh';

export const useRefreshSession = () => {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: refreshSession,
    retry: false,
    staleTime: Infinity,
  });
};
