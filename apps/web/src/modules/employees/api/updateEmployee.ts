import type { UpdateEmployeeBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

type UpdateEmployeeInput = UpdateEmployeeBody & { id: string };

const updateEmployee = async ({ id, ...body }: UpdateEmployeeInput): Promise<MessageResponse> => {
  const response = await api.patch<MessageResponse>(ApiRoutes.organizations.employee(id), body);
  return response.data;
};

export const useUpdateEmployee = () => {
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.list() });
    },
  });
};
