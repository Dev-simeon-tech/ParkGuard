import { cva, type VariantProps } from 'class-variance-authority';
import { Text, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

export const badgeVariants = cva('flex-row items-center gap-1 self-start rounded-full px-2.5 py-1', {
  variants: {
    variant: {
      default: 'bg-neutral-100',
      success: 'bg-green-100',
      destructive: 'bg-red-100',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'text-neutral-900',
      success: 'text-green-800',
      destructive: 'text-red-800',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type BadgeProps = ViewProps &
  VariantProps<typeof badgeVariants> & {
    className?: string;
  };

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {typeof children === 'string' ? (
        <Text className={badgeTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
