import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

const disableEmployee = async (id: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.organizations.disableEmployee(id));
  return response.data;
};

export const useDisableEmployee = () => {
  return useMutation({
    mutationFn: disableEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.list() });
    },
  });
};
