import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';
import type { MessageResponse } from '../types';

const resendVerification = async (email: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.auth.resendVerification, { email });
  return response.data;
};

export const useResendVerification = () => {
  return useMutation({ mutationFn: resendVerification });
};
