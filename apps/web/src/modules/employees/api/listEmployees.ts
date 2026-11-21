import type { OrganizationMember } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

const listEmployees = async (): Promise<OrganizationMember[]> => {
  const response = await api.get<{ employees: OrganizationMember[] }>(ApiRoutes.organizations.employees);
  return response.data.employees;
};

export const useListEmployees = () => {
  return useQuery({
    queryKey: queryKeys.employees.list(),
    queryFn: listEmployees,
  });
};
