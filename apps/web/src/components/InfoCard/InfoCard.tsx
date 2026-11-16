import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type InfoCardProps = {
  variant?: 'default' | 'error';
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function InfoCard({ variant = 'default', title, subtitle, action, className }: InfoCardProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 text-center', className)}>
      <h2 className={cn('text-lg font-semibold', variant === 'error' && 'text-red-600')}>{title}</h2>
      {subtitle ? <p className="text-sm text-neutral-500">{subtitle}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
