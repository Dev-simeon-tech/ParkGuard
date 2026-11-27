import { MutationCache, QueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/utils/handleApiError';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipErrorToast) {
        return;
      }
      handleApiError(error);
    },
  }),
});
