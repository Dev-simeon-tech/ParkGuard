import {
  animate,
  domAnimation,
  LazyMotion,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { type ReactNode, useRef, useEffect } from 'react';

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
};

export function RevealSection({ children, ...props }: RevealSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        {...props}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
      >
        {children}
      </m.section>
    </LazyMotion>
  );
}

type AnimatedContainerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedContainer({ children, className, delay = 0.1 }: AnimatedContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={prefersReducedMotion ? false : { filter: 'blur(4px)', y: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : 0.8,
      }}
    >
      {children}
    </m.div>
  );
}

type MetricCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export function MetricCounter({ value, prefix = '', suffix = '' }: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const displayValue = useTransform(
    count,
    (current) => `${prefix}${Math.round(current).toLocaleString()}${suffix}`,
  );

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return () => controls.stop();
  }, [count, isInView, prefersReducedMotion, value]);

  return <m.span ref={ref}>{displayValue}</m.span>;
}
