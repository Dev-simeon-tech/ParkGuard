import { BranchPermissions } from './branches';
import { OrganizationPermissions } from './organization';
import { RevenuePermissions } from './revenue';
import { SessionPermissions } from './sessions';

export const Permissions = {
  organization: OrganizationPermissions,
  branches: BranchPermissions,
  revenue: RevenuePermissions,
  sessions: SessionPermissions,
} as const;
