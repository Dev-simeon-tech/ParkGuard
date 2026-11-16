import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';

const logout = async (): Promise<void> => {
  await api.post(ApiRoutes.auth.logout, {});
};

export const useLogout = () => {
  return useMutation({ mutationFn: logout });
};
