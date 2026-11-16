import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const badgeVariants = cva('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-neutral-100 text-neutral-900',
      success: 'bg-green-100 text-green-800',
      destructive: 'bg-red-100 text-red-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
