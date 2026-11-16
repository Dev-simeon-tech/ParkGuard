export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  role: string | null;
};

export type OrganizationSummary = {
  id: string;
  name: string;
};

export type AuthBranch = {
  branchId: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  branches: AuthBranch[];
  permissions: string[];
  organization: OrganizationSummary | null;
  user: PublicUser;
};

export type OrganizationMember = {
  id: string;
  user: Omit<PublicUser, 'role'>;
  role: string;
  branches: { id: string; name: string }[];
  acceptedAt: string | null;
  disabledAt: string | null;
  createdAt: string;
};

export type RoleSummary = {
  id: string;
  name: string;
};
