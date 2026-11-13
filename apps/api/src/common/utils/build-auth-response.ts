import type { AuthBranch, AuthResponse, OrganizationSummary, PublicUser } from '@parkguard/types';
import { EmployeeBranchEntity, type UserEntity } from '@/db/entities';
import { getOrganizationContext } from './get-organization-context';
import { serializeUser } from './serialize-user';

type UserContextResponse = {
  permissions: string[];
  organization: OrganizationSummary | null;
  user: PublicUser;
};

export async function buildUserContextResponse(user: UserEntity): Promise<UserContextResponse> {
  const context = await getOrganizationContext(user.id);
  return {
    permissions: context?.permissions ?? [],
    organization: context?.organization ?? null,
    user: { ...serializeUser(user), role: context?.role ?? null },
  };
}

type AuthResponseInput = {
  accessToken: string;
  refreshToken?: string;
  user: UserEntity;
};

export async function buildAuthResponse(input: AuthResponseInput): Promise<AuthResponse> {
  const context = await buildUserContextResponse(input.user);
  const branches: AuthBranch[] = context.organization
    ? (
        await EmployeeBranchEntity.find({
          where: {
            organizationUser: {
              user: { id: input.user.id },
              organization: { id: context.organization.id },
            },
          },
          relations: { branch: true },
        })
      ).map(({ branch }) => ({ branchId: branch.id, name: branch.name }))
    : [];

  return {
    accessToken: input.accessToken,
    ...(input.refreshToken ? { refreshToken: input.refreshToken } : {}),
    branches,
    ...context,
  };
}
