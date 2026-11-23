import type { UpdateBranchBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

type UpdateBranchInput = UpdateBranchBody & { id: string };

const updateBranch = async ({ id, ...body }: UpdateBranchInput): Promise<MessageResponse> => {
  const response = await api.patch<MessageResponse>(ApiRoutes.branches.branch(id), body);
  return response.data;
};

export const useUpdateBranch = () => {
  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.list() });
    },
  });
};
