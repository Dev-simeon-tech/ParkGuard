import type { ForgotPasswordBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';
import type { MessageResponse } from '../types';

const forgotPassword = async (body: ForgotPasswordBody): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.auth.forgotPassword, body);
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation({ mutationFn: forgotPassword });
};
