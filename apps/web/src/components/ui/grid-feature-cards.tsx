import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export type FeatureCardData = {
  title: string;
  icon: LucideIcon;
  description: string;
};

type FeatureCardProps = ComponentProps<'article'> & {
  feature: FeatureCardData;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  return (
    <article
      className={cn(
        'group relative min-h-[200px] overflow-hidden bg-white px-7 py-7',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-[68%] opacity-90 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_75%)]">
          <GridPattern className="absolute inset-0 size-full stroke-slate-400/35" />
        </div>
      </div>
      <feature.icon
        className="relative size-6 text-foreground/75"
        strokeWidth={1}
        aria-hidden="true"
      />
      <h3 className="relative mt-14 text-base font-normal text-foreground">
        {feature.title}
      </h3>
      <p className="relative z-10 mt-2 text-sm font-light leading-5 text-muted-foreground">
        {feature.description}
      </p>
    </article>
  );
}

function GridPattern({ className }: { className?: string }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 120 80" preserveAspectRatio="none">
      <defs>
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M.5 20V.5H20" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} strokeWidth={0} />
      <g className="fill-slate-400/10" strokeWidth={0}>
        <rect x="60" y="20" width="21" height="21" />
        <rect x="100" y="40" width="21" height="21" />
      </g>
    </svg>
  );
}
