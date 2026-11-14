import type { AcceptInviteBody } from '@parkguard/schemas';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { api } from '@/lib/axios';
import type { MessageResponse } from '../types';

const acceptInvite = async (body: AcceptInviteBody): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(ApiRoutes.organizations.acceptInvite, body);
  return response.data;
};

export const useAcceptInvite = () => {
  return useMutation({ mutationFn: acceptInvite });
};
