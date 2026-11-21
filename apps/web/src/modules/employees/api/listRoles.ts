import type { RoleSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

const listRoles = async (): Promise<RoleSummary[]> => {
  const response = await api.get<{ roles: RoleSummary[] }>(ApiRoutes.organizations.roles);
  return response.data.roles;
};

export const useListRoles = () => {
  return useQuery({
    queryKey: queryKeys.employees.roles(),
    queryFn: listRoles,
  });
};
