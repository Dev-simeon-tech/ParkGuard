import { CarFront, CalendarDays, CircleHelp, DoorOpen, Info, LogIn, LogOut, Wallet } from 'lucide-react';
import { useState } from 'react';
import MoneyIcon from '@/assets/money-Icon.svg?react';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { formatNaira } from '@/utils/formatCurrency';
import { useSessionsAnalytics } from '../api/getSessionsAnalytics';

const metricCards = [
  {
    key: 'currentlyParked',
    label: 'Currently parked',
    hint: 'Vehicles on site',
    icon: CarFront,
    color: 'teal',
  },
  {
    key: 'totalCarsIn',
    label: 'Entries today',
    hint: 'Vehicles checked in',
    icon: LogIn,
    color: 'blue',
  },
  {
    key: 'totalCarsOut',
    label: 'Exits today',
    hint: 'Vehicles checked out',
    icon: LogOut,
    color: 'green',
  },
  {
    key: 'totalRevenue',
    label: 'Expected revenue',
    hint: 'For selected date',
    icon: Wallet,
    color: 'violet',
  },
] as const;

export function DashboardPage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const {
    data: analytics,
    isLoading,
    isError: analyticsError,
    refetch,
  } = useSessionsAnalytics(dateKey);

  if (analyticsError) {
    return (
      <div className="mx-auto max-w-6xl pt-8">
        <InfoCard
          variant="error"
          title="We couldn’t load your dashboard"
          subtitle="Check your connection and try again."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      </div>
    );
  }

  if (!analytics || isLoading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center" aria-label="Loading dashboard">
        <Spinner />
      </section>
    );
  }

  const busiestCount = Math.max(analytics.totalCarsIn, analytics.totalCarsOut, 1);
  const displayDate = new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-secondary">
            <span className="size-1.5 rounded-full bg-secondary" />
            Parking overview
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#211f1b] sm:text-[34px]">
            Good {getGreeting()}, {user?.firstName || 'there'}
          </h1>
          <p className="mt-2 text-sm text-[#817a6f]">
            Here&apos;s what&apos;s happening across your parking operations.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-between gap-3 rounded-xl border border-[#e9e1d6] bg-[#fffcf6] px-3.5 text-left shadow-[0_2px_6px_rgba(62,47,26,.03)] transition hover:border-[#c5ddd7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              aria-label={`Choose date, currently ${displayDate}`}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-[#e6f4f1] text-secondary">
                <CalendarDays size={16} />
              </span>
              <span className="text-sm font-medium text-[#37332c]">{displayDate}</span>
              <span className="ml-2 text-xs text-[#989084]">⌄</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto rounded-2xl border-[#eee6db] bg-[#fffcf6] p-2 shadow-xl" align="end">
            <Calendar
              mode="single"
              endMonth={new Date()}
              today={new Date()}
              disabled={{ after: new Date() }}
              selected={date}
              onSelect={setDate}
              required
            />
          </PopoverContent>
        </Popover>
      </div>

      <section aria-label="Daily parking metrics" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metricCards.map(({ key, label, hint, icon: Icon, color }) => {
          const value = analytics[key];
          return (
            <article
              key={key}
              className="group rounded-2xl border border-[#eee6db] bg-[#fffcf6] p-5 shadow-[0_3px_12px_rgba(62,47,26,.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-18px_rgba(62,47,26,.22)] sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-[#756f64]">{label}</p>
                  <p className="mt-1.5 text-xs text-[#a39b8e]">{hint}</p>
                </div>
                <div className={`grid size-10 place-items-center rounded-xl ${metricTone(color)}`}>
                  {key === 'totalRevenue' ? <MoneyIcon className="size-[18px]" /> : <Icon size={18} strokeWidth={1.8} />}
                </div>
              </div>
              <p className="mt-7 text-[32px] font-semibold leading-none tracking-[-0.045em] text-[#292721] tabular-nums">
                {key === 'totalRevenue' ? formatNaira(value) : value.toLocaleString('en-NG')}
              </p>
              <div className="mt-4 h-px bg-[#f1ebe1]" />
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#a39b8e]">
                {displayDate}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.8fr)]">
        <article className="overflow-hidden rounded-2xl border border-[#eee6db] bg-[#fffcf6] shadow-[0_3px_12px_rgba(62,47,26,.035)]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f0e9df] px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-base font-semibold tracking-[-0.02em] text-[#292721]">Today&apos;s vehicle flow</h2>
              <p className="mt-1 text-xs text-[#91897d]">Entries and exits for {displayDate}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ef] px-2.5 py-1.5 text-[11px] font-medium text-[#477557]">
              <span className="size-1.5 rounded-full bg-[#6eaa7c]" /> Live daily totals
            </span>
          </div>
          <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
            <FlowBar label="Entries" value={analytics.totalCarsIn} total={busiestCount} icon={DoorOpen} tone="bg-secondary" />
            <FlowBar label="Exits" value={analytics.totalCarsOut} total={busiestCount} icon={LogOut} tone="bg-[#8c9c7a]" />
            <div className="flex items-center justify-between rounded-xl bg-[#f8f4ec] px-4 py-3.5">
              <div className="flex items-center gap-2.5 text-sm text-[#625c51]">
                <CarFront size={17} className="text-secondary" />
                Vehicles currently parked
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#292721] tabular-nums">
                {analytics.currentlyParked.toLocaleString('en-NG')}
              </span>
            </div>
          </div>
        </article>

        <article className="relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl bg-[#282820] p-6 text-[#fffaf0] shadow-[0_12px_30px_-20px_rgba(31,28,20,.55)] sm:p-7">
          <div className="pointer-events-none absolute -right-14 -top-16 size-56 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -right-2 -top-8 size-36 rounded-full border border-white/[0.08]" />
          <div className="relative flex items-center gap-2 text-xs font-medium text-[#86cfc3]">
            <span className="size-1.5 rounded-full bg-[#86f2e4]" />
            At a glance
          </div>
          <div className="relative mt-9">
            <p className="text-sm text-[#c4bdae]">Vehicles on site</p>
            <p className="mt-2 text-6xl font-semibold tracking-[-0.06em] tabular-nums">
              {analytics.currentlyParked.toLocaleString('en-NG')}
            </p>
          </div>
          <div className="relative mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] text-[#a7a092]">Selected day</p>
              <p className="mt-1 text-sm font-medium text-[#f5ede0]">{displayDate}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#86f2e4] text-[#005049]">
              <CarFront size={22} />
            </div>
          </div>
        </article>
      </section>

      {user?.role === 'admin' && (
        <section className="mt-5 rounded-2xl border border-[#cce5df] bg-[#eff8f5] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#dff1ed] text-secondary">
              <Info size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-[#293a36]">Get your parking workspace ready</h2>
                  <p className="mt-1 text-xs text-[#687d76]">A few steps to get your team up and running.</p>
                </div>
                <CircleHelp size={17} className="text-secondary-variant" />
              </div>
              <ol className="mt-5 grid gap-3 text-xs leading-5 text-[#536b63] sm:grid-cols-2 xl:grid-cols-4">
                <SetupStep number="01" title="Set up a branch" description="Add your parking location and configure its rates." />
                <SetupStep number="02" title="Invite attendants" description="Add your team and assign them to a branch." />
                <SetupStep number="03" title="Start logging cars" description="Your attendants can record vehicle entries and exits." />
                <SetupStep number="04" title="Review revenue" description="Compare expected revenue across your operations." />
              </ol>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FlowBar({
  label,
  value,
  total,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  icon: typeof DoorOpen;
  tone: string;
}) {
  const width = value === 0 ? 0 : Math.max(3, (value / total) * 100);
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[#5c574e]">
          <Icon size={16} className="text-[#9a9286]" />
          {label}
        </div>
        <span className="text-sm font-semibold text-[#333027] tabular-nums">{value.toLocaleString('en-NG')}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f0ebe2]">
      <div className={`h-full rounded-full transition-[width] duration-500 ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SetupStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <li className="flex gap-2.5">
      <span className="pt-0.5 font-mono text-[10px] font-semibold tracking-wide text-secondary">{number}</span>
      <span><strong className="block font-semibold text-[#344a42]">{title}</strong>{description}</span>
    </li>
  );
}

function metricTone(color: string) {
  const tones: Record<string, string> = {
    teal: 'bg-[#e6f4f1] text-secondary',
    blue: 'bg-[#eaf0f5] text-[#55758f]',
    green: 'bg-[#edf2e9] text-[#668052]',
    violet: 'bg-[#f0ebf3] text-[#826b91]',
  };
  return tones[color] ?? tones.teal;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
