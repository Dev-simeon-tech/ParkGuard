import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/utils/cn';

export type Series = {
  key: string;
  label: string;
  slot?: 1 | 2 | 3 | 4 | 5;
};

const seriesColor = (series: Series, index: number) =>
  `var(--chart-${series.slot ?? (index % 5) + 1})`;

export function ChartCard({
  title,
  subtitle,
  actions,
  className,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={cn(
        'm-0 grid min-w-0 gap-4 rounded-[18px] bg-card p-5 text-card-foreground ring-1 ring-border',
        className,
      )}
    >
      <figcaption className="flex items-start justify-between gap-3">
        <div className="grid gap-0.5">
          <span className="text-[14px] font-semibold tracking-[-0.01em]">{title}</span>
          {subtitle && <span className="text-[12px] text-muted-foreground">{subtitle}</span>}
        </div>
        {actions}
      </figcaption>
      {children}
    </figure>
  );
}

export function BarCompare<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  format = (value: number) => value.toLocaleString(),
  height = 220,
  description,
}: {
  data: T[];
  xKey: keyof T & string;
  series: Series[];
  format?: (value: number) => string;
  height?: number;
  description: string;
}) {
  return (
    <div className="grid gap-3">
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden>
          {series.map((item, index) => (
            <li
              key={item.key}
              className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
            >
              <span
                className="h-2 w-2 rounded-[3px]"
                style={{ background: seriesColor(item, index) }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label={description} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey={xKey as string}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickFormatter={format}
              width={48}
            />
            <Tooltip
              cursor={{ fill: 'var(--accent)', opacity: 0.6 }}
              formatter={(value) => format(Number(value))}
            />
            {series.map((item, index) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.label}
                fill={seriesColor(item, index)}
                maxBarSize={24}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <table>
          <caption>{description}</caption>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <th>{String(row[xKey])}</th>
                {series.map((item) => (
                  <td key={item.key}>{format(Number(row[item.key]))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Sparkline({
  data,
  height = 28,
  className,
}: {
  data: number[];
  height?: number;
  className?: string;
}) {
  const rows = data.map((value, index) => ({ index, value }));
  return (
    <div aria-hidden className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            strokeLinecap="round"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  good = 'up',
  period,
  trend,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  good?: 'up' | 'down';
  period?: string;
  trend?: number[];
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  const positive = delta === undefined ? null : (up && good === 'up') || (!up && good === 'down');

  return (
    <div
      className={cn(
        'grid gap-2 rounded-[14px] bg-card p-4 text-card-foreground ring-1 ring-border',
        className,
      )}
    >
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[24px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {value}
        </p>
        {trend && <Sparkline data={trend} className="w-20" />}
      </div>
      {delta !== undefined && (
        <p className="flex items-center gap-1 text-[12px]">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium tabular-nums',
              positive
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-red-700 dark:text-red-400',
            )}
          >
            {up ? (
              <ArrowUpRight className="size-3.5" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden />
            )}
            <span className="sr-only">{up ? 'Up' : 'Down'} </span>
            {Math.abs(delta * 100).toFixed(1)}%
          </span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </p>
      )}
    </div>
  );
}
