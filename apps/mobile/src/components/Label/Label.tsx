import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { cn } from '@/utils/cn';

export type LabelProps = TextProps & { className?: string };

export function Label({ className, ...props }: LabelProps) {
  return <Text className={cn('text-sm font-medium text-neutral-900', className)} {...props} />;
}
