import type { PropsWithChildren } from 'react';

export function CenteredLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full">{children}</div>
    </div>
  );
}
