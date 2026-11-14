import { ListSessionsQuery } from '@parkguard/schemas';
export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
    verifyEmail: (token: string) => ['auth', 'verify-email', token] as const,
    verifyResetPasswordToken: (token: string) =>
      ['auth', 'verify-reset-password-token', token] as const,
    verifyInvite: (token: string) => ['auth', 'verify-invite', token] as const,
  },
  employees: {
    list: () => ['employees', 'list'] as const,
    roles: () => ['employees', 'roles'] as const,
    activities: () => ['attendant', 'analytics'],
  },
  branches: {
    list: () => ['branch', 'list'] as const,
  },
  rates: {
    list: () => ['rates', 'list'] as const,
  },
  parkingLog: {
    list: (query: ListSessionsQuery) => ['sessions', 'parking', query] as const,
    analytics: (date: string) => ['sessions', 'analytics', date] as const,
    revenue: (date: string) => ['revenue', 'analytics', date] as const,
  },
  vehicles: {
    list: (query?: string) => ['vehicles', query] as const,
    get: (id: string) => ['vehicles', id] as const,
  },
} as const;
