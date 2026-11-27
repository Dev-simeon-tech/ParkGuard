import { ListSessionsQuery } from '@parkguard/schemas';

export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  sessions: {
    list: (query: ListSessionsQuery) => ['sessions', 'parking', query] as const,
    lists: () => ['sessions', 'parking'] as const,
    get: (id: string) => ['session', 'parking', id] as const,
    analytics: () => ['session', 'analytics'] as const,
  },
} as const;
