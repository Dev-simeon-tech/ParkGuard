import type { ResetPasswordBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';
import type { MessageResponse } from '../types';

const resetPassword = async (body: ResetPasswordBody): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.auth.resetPassword, body);
  return response.data;
};

export const useResetPassword = () => {
  return useMutation({ mutationFn: resetPassword });
};
