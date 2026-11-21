import type { InviteMemberBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import type { MessageResponse } from '../types';

const inviteMember = async (body: InviteMemberBody): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.organizations.inviteMember, body);
  return response.data;
};

export const useInviteMember = () => {
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.list() });
    },
  });
};
