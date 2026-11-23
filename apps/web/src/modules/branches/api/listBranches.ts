import type { BranchSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

const listBranches = async (): Promise<BranchSummary[]> => {
  const response = await api.get<{ branches: BranchSummary[] }>(ApiRoutes.branches.listBranches);
  return response.data.branches;
};

export const useListBranches = () => {
  return useQuery({
    queryKey: queryKeys.branches.list(),
    queryFn: listBranches,
  });
};
