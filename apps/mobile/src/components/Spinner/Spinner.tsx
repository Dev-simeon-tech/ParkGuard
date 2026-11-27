import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type SpinnerProps = Omit<ViewProps, 'style'> & {
  /** Diameter of the spinner in pixels. */
  size?: number;
  /** Color of the visible part of the spinner ring. */
  color?: string;
  /** Duration of one full rotation in milliseconds. */
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

export function Spinner({
  size = 24,
  color = '#0d9488',
  duration = 800,
  style,
  accessible = true,
  accessibilityLabel = 'Loading',
  accessibilityRole = 'progressbar',
  ...props
}: SpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rotation.setValue(0);

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [duration, rotation]);

  const strokeWidth = Math.max(2, Math.round(size / 8));
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      {...props}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      style={[
        {
          width: size,
          height: size,
          borderWidth: strokeWidth,
          borderRadius: size / 2,
          borderColor: color,
          borderTopColor: 'transparent',
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    />
  );
}
