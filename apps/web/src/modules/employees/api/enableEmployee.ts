import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

const enableEmployee = async (id: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.organizations.enableEmployee(id));
  return response.data;
};

export const useEnableEmployee = () => {
  return useMutation({
    mutationFn: enableEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.list() });
    },
  });
};
