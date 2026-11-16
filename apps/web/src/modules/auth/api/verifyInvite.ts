import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import type { InviteTokenInfo } from '../types';

const verifyInvite = async (token: string): Promise<InviteTokenInfo> => {
  const response = await api.get<InviteTokenInfo>(ApiRoutes.organizations.verifyInvite, {
    params: { token },
  });
  return response.data;
};

export const useVerifyInvite = (token: string) => {
  return useQuery({
    queryKey: queryKeys.auth.verifyInvite(token),
    queryFn: () => verifyInvite(token),
    enabled: Boolean(token),
    retry: false,
  });
};
