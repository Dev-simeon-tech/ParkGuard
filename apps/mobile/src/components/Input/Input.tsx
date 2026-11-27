import { forwardRef } from 'react';
import type { ElementRef, ReactNode } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

export type InputProps = TextInputProps & {
  className?: string;
  containerClassName?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
};

export const Input = forwardRef<ElementRef<typeof TextInput>, InputProps>(
  ({ className, containerClassName, leftIcon, rightElement, editable, ...props }, ref) => {
    return (
      <View
        className={cn(
          'flex-row items-center rounded-lg bg-neutral-100 px-3',
          editable === false && 'opacity-50',
          containerClassName,
        )}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          editable={editable}
          className={cn('h-12 flex-1 px-2 text-sm text-neutral-900', className)}
          placeholderTextColor="#a3a3a3"
          {...props}
        />
        {rightElement}
      </View>
    );
  },
);

Input.displayName = 'Input';
