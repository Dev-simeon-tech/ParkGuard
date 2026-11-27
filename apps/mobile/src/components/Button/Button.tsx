import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Pressable, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { cn } from '@/utils/cn';

export const buttonVariants = cva('flex-row items-center justify-center gap-2 rounded-md', {
  variants: {
    variant: {
      primary: 'bg-brand-primary active:opacity-90',
      secondary: 'bg-neutral-100 active:bg-neutral-200',
      outline: 'border border-neutral-300 bg-transparent active:bg-neutral-100',
    },
    size: {
      sm: 'h-9 px-3',
      md: 'h-12 px-4',
      lg: 'h-14 px-6',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-neutral-900',
      outline: 'text-neutral-900',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, disabled, children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text className={buttonTextVariants({ variant, size })}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
