import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

const disableBranch = async (id: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.branches.disableBranch(id));
  return response.data;
};

export const useDisableBranch = () => {
  return useMutation({
    mutationFn: disableBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.list() });
    },
  });
};
