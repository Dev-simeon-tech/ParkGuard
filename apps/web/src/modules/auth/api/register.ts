import type { RegisterBody } from '@parkguard/schemas';
import type { AuthResponse } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';

const register = async (body: RegisterBody): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(ApiRoutes.auth.register, body);
  return response.data;
};

export const useRegister = () => {
  return useMutation({ mutationFn: register });
};
