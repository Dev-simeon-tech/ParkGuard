import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-secondary text-white hover:bg-secondary-variant',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = 'Button';
