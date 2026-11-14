import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import type { MessageResponse } from '../types';

const verifyEmail = async (token: string): Promise<MessageResponse> => {
  const response = await api.get<MessageResponse>(ApiRoutes.auth.verifyEmail, { params: { token } });
  return response.data;
};

export const useVerifyEmail = (token: string) => {
  return useQuery({
    queryKey: queryKeys.auth.verifyEmail(token),
    queryFn: () => verifyEmail(token),
    enabled: Boolean(token),
    retry: false,
  });
};
