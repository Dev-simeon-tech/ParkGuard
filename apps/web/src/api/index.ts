import { Entities } from './entities';

const apiVersion = 'v1';
const apiPrefix = 'api';
const BASE_PATH = `/${apiPrefix}/${apiVersion}`;

export const ApiRoutes = {
  auth: {
    register: `${BASE_PATH}/${Entities.AUTH}/register`,
    login: `${BASE_PATH}/${Entities.AUTH}/login`,
    refresh: `${BASE_PATH}/${Entities.AUTH}/refresh`,
    logout: `${BASE_PATH}/${Entities.AUTH}/logout`,
    verifyEmail: `${BASE_PATH}/${Entities.AUTH}/verify-email`,
    resendVerification: `${BASE_PATH}/${Entities.AUTH}/resend-verification`,
    forgotPassword: `${BASE_PATH}/${Entities.AUTH}/forgot-password`,
    verifyResetPasswordToken: `${BASE_PATH}/${Entities.AUTH}/reset-password/verify`,
    resetPassword: `${BASE_PATH}/${Entities.AUTH}/reset-password`,
  },
  organizations: {
    inviteMember: `${BASE_PATH}/${Entities.ORGANIZATIONS}/invitations`,
    verifyInvite: `${BASE_PATH}/${Entities.ORGANIZATIONS}/invitations/verify`,
    acceptInvite: `${BASE_PATH}/${Entities.ORGANIZATIONS}/invitations/accept`,
    roles: `${BASE_PATH}/${Entities.ORGANIZATIONS}/roles`,
    employees: `${BASE_PATH}/${Entities.ORGANIZATIONS}/employees`,
    employeeActivities: (query: string) =>
      `${BASE_PATH}/${Entities.SESSIONS}/analytics/attendant/?${query}`,
    employee: (id: string) => `${BASE_PATH}/${Entities.ORGANIZATIONS}/employees/${id}`,
    disableEmployee: (id: string) =>
      `${BASE_PATH}/${Entities.ORGANIZATIONS}/employees/${id}/disable`,
    enableEmployee: (id: string) => `${BASE_PATH}/${Entities.ORGANIZATIONS}/employees/${id}/enable`,
  },
  users: {
    me: `${BASE_PATH}/${Entities.USERS}/me`,
  },
  branches: {
    createBranch: `${BASE_PATH}/${Entities.BRANCH}/`,
    listBranches: `${BASE_PATH}/${Entities.BRANCH}/`,
    branch: (id: string) => `${BASE_PATH}/${Entities.BRANCH}/${id}`,
    disableBranch: (id: string) => `${BASE_PATH}/${Entities.BRANCH}/${id}/disable`,
    enableBranch: (id: string) => `${BASE_PATH}/${Entities.BRANCH}/${id}/enable`,
  },
  rates: {
    rates: `${BASE_PATH}/${Entities.RATES}/`,
    rate: (id: string) => `${BASE_PATH}/${Entities.RATES}/${id}`,
  },
  parkingLog: {
    list: (query: string) => `${BASE_PATH}/${Entities.SESSIONS}/?${query}`,
    analytics: (date: string) => `${BASE_PATH}/${Entities.SESSIONS}/analytics/?date=${date}`,
    revenue: (date: string) => `${BASE_PATH}/${Entities.SESSIONS}/revenue/?date=${date}`,
  },
  vehicles: {
    listQuery: (query: string) => `${BASE_PATH}/${Entities.VEHICLES}/?search=${query}`,
    list: `${BASE_PATH}/${Entities.VEHICLES}/`,
    get: (id: string) => `${BASE_PATH}/${Entities.VEHICLES}/${id}`,
  },
} as const;
