import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60_000,
    },
  },
  queryCache: new QueryCache({
    onError: (_error, query) => {
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipErrorToast) {
        return;
      }
      handleApiError(error);
    },
  }),
});

export type ApiFnReturnType<FnType extends (...args: unknown[]) => Promise<unknown>> = Awaited<
  ReturnType<FnType>
>;
