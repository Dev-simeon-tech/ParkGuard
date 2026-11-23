import type { CreateBranchBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

const createBranch = async (body: CreateBranchBody): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.branches.createBranch, body);
  return response.data;
};

export const useCreateBranch = () => {
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.rates.list() });
    },
  });
};
