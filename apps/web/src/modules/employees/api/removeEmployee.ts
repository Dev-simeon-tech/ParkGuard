import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';

const removeEmployee = async (id: string): Promise<void> => {
  await api.delete(ApiRoutes.organizations.employee(id));
};

export const useRemoveEmployee = () => {
  return useMutation({
    mutationFn: removeEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.list() });
    },
  });
};
