import { cn } from '@/utils/cn';

export type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary',
        className,
      )}
    />
  );
}
