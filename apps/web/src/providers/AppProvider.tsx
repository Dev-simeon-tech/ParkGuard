import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from './AuthProvider';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
