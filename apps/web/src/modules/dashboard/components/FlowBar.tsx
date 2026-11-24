import type { LucideIcon } from 'lucide-react';

export function FlowBar({
  label,
  value,
  total,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  icon: LucideIcon;
  tone: string;
}) {
  const width = value === 0 ? 0 : Math.max(3, (value / total) * 100);
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-container">
          <Icon size={16} className="text-primary-container" />
          {label}
        </div>
        <span className="text-sm font-semibold text-secondary tabular-nums">
          {value.toLocaleString('en-NG')}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#cce5df]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${tone}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
