import type { InviteMemberBody } from '@parkguard/schemas';

export type InviteMemberInput = InviteMemberBody & {
  organizationId: string;
};

export type InviteTokenInfo = {
  email: string;
  organizationName: string;
};
