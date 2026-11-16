import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import type { PasswordResetTokenInfo } from '../types';

const verifyResetPasswordToken = async (token: string): Promise<PasswordResetTokenInfo> => {
  const response = await api.get<PasswordResetTokenInfo>(ApiRoutes.auth.verifyResetPasswordToken, {
    params: { token },
  });
  return response.data;
};

export const useVerifyResetPasswordToken = (token: string) => {
  return useQuery({
    queryKey: queryKeys.auth.verifyResetPasswordToken(token),
    queryFn: () => verifyResetPasswordToken(token),
    enabled: Boolean(token),
    retry: false,
  });
};
