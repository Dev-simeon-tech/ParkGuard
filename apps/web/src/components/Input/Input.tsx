import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
