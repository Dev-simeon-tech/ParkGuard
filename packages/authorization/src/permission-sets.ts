import { Permissions } from './permissions';

export const PermissionSets = {
  organization: {
    MANAGE_MEMBERS: [Permissions.organization.MANAGE_MEMBERS],
  },
  branches: {
    MANAGE: [Permissions.branches.MANAGE],
    VIEW: [Permissions.branches.MANAGE, Permissions.organization.MANAGE_MEMBERS],
  },
  revenue: {
    MANAGE: [Permissions.revenue.MANAGE],
  },
  sessions: {
    MANAGE: [Permissions.sessions.MANAGE],
    VIEW: [Permissions.sessions.VIEW, Permissions.sessions.MANAGE],
  },
} as const;
