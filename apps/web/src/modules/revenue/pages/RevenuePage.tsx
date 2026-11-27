import { CalendarIcon, ClipboardX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { BarCompare, ChartCard, KpiCard } from '@/components/ui/revenue-charts-kpi';
import { formatNaira } from '@/utils/formatCurrency';
import { useRevenueAnalytics } from '../api/getRevenueAnalytics';

export function RevenuePage() {
  const [date, setDate] = useState(new Date());
  const {
    data: revenueData,
    isLoading,
    isError,
    refetch,
  } = useRevenueAnalytics(date.toISOString().split('T')[0]);

  if (isLoading) {
    return (
      <section className="h-40 flex justify-center items-center">
        <Spinner />
      </section>
    );
  }

  if (isError || !revenueData) {
    return (
      <InfoCard
        variant="error"
        title="Something went wrong while getting revenue data"
        subtitle="Click retry to fetch data"
        action={<Button onClick={() => refetch()}>retry</Button>}
      />
    );
  }
  const previousRevenue =
    revenueData.previousWeek?.totalExpectedRevenue ??
    revenueData.previousWeekTotalExpectedRevenue ??
    0;
  const revenueDelta =
    previousRevenue > 0
      ? revenueData.totalExpectedRevenue / previousRevenue - 1
      : revenueData.totalExpectedRevenue > 0
        ? 1
        : 0;
  const previousBranches = revenueData.previousWeek?.activeBranches ?? revenueData.activeBranches;
  const previousAttendants =
    revenueData.previousWeek?.activeAttendants ?? revenueData.activeAttendants;
  const branchesDelta =
    previousBranches > 0
      ? revenueData.activeBranches / previousBranches - 1
      : revenueData.activeBranches > 0
        ? 1
        : 0;
  const attendantsDelta =
    previousAttendants > 0
      ? revenueData.activeAttendants / previousAttendants - 1
      : revenueData.activeAttendants > 0
        ? 1
        : 0;
  const naira = (value: number) => formatNaira(value);
  const branchChartData = revenueData.branches.map((branch) => ({
    branch: branch.branchName,
    revenue: branch.expectedRevenue,
  }));
  const weeklyTrend = revenueData.weeklyTrend?.map((item) => item.revenue) ?? [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <article>
          <h2 className="text-2xl lg:text-3xl font-semibold pb-2">Revenue Assessment</h2>
          <p>
            View System-calculated expected revenue for audit and reconciliation for a specific date
          </p>
        </article>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              date-empty={!date}
              variant={'outline'}
              className="w-40 flex items-center  gap-1"
            >
              <CalendarIcon size={18} />
              <p>{new Intl.DateTimeFormat('en-GB').format(date)}</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              endMonth={new Date()}
              today={new Date()}
              disabled={{
                after: new Date(),
              }}
              selected={date}
              onSelect={setDate}
              required
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Total expected revenue"
          value={formatNaira(revenueData.totalExpectedRevenue)}
          delta={revenueDelta}
          period="vs previous week"
          trend={weeklyTrend}
        />
        <KpiCard
          label="Active branches"
          value={revenueData.activeBranches.toString()}
          delta={branchesDelta}
          period="vs previous week"
        />
        <KpiCard
          label="Active attendants"
          value={revenueData.activeAttendants.toString()}
          delta={attendantsDelta}
          period="vs previous week"
        />
      </div>

      {revenueData?.branches.length === 0 ? (
        <div className="flex flex-col justify-center mt-10 items-center gap-4">
          <ClipboardX size={50} className="text-primary-container" />
          <h2 className="font-semibold">No Revenue data yet</h2>
          <p className="max-w-[40ch] mx-auto text-center">
            Create and close parking sessions to record revenue data
          </p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-1">
          <ChartCard
            title="Expected revenue by branch"
            subtitle="Revenue recorded for the selected date"
          >
            <div className="grid gap-2">
              {revenueData.branches.map((branch) => (
                <div
                  key={branch.branchId}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-input-bg px-4 py-3"
                >
                  <span className="text-[13px] font-medium">{branch.branchName}</span>
                  <span className="text-[13px] font-semibold tabular-nums text-secondary">
                    {naira(branch.expectedRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Revenue comparison" subtitle="Expected revenue by branch">
            <BarCompare
              data={branchChartData}
              xKey="branch"
              series={[{ key: 'revenue', label: 'Revenue', slot: 1 }]}
              format={naira}
              description="Expected revenue by branch"
              height={260}
            />
          </ChartCard>
        </div>
      )}
    </section>
  );
}
