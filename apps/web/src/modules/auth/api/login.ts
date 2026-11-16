import type { LoginBody } from '@parkguard/schemas';
import type { AuthResponse } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';

const login = async (body: LoginBody): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(ApiRoutes.auth.login, body);
  return response.data;
};

export const useLogin = () => {
  return useMutation({ mutationFn: login });
};
