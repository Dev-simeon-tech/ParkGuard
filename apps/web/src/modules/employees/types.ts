export type { OrganizationMember, RoleSummary } from '@parkguard/types';

export type StatusFilter = 'all' | 'active' | 'disabled';
export type RoleFilter = 'all' | 'admin' | 'attendant' | 'auditor';

export type MessageResponse = {
  message: string;
};
