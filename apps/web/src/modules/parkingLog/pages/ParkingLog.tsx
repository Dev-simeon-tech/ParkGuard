import { ClipboardX, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useDataTableState } from '@/components/DataTable/useDataTableState';
import { InfoCard } from '@/components/InfoCard';
import { Input } from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Spinner } from '@/components/Spinner';
import { Routes } from '@/config/routes';
import { useDebounce } from '@/hooks/useDebounce';
import { useListParkingLogs } from '../api/listParkingLog';
import ParkingLogTable from '../components/ParkingLogTable';

type Status = 'active' | 'completed';

export function ParkingLogPage() {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
  } = useDataTableState();
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const statusFilter = columnFilters.find((filter) => filter.id === 'status')?.value as
    Status | undefined;
  const { data, isLoading, isError, refetch } = useListParkingLogs({
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    plateNumber: debouncedGlobalFilter,
    status: statusFilter,
  });

  return (
    <div>
      <article className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-semibold pb-2">Parking Log</h2>
        <p>View and manage all parking transactions and activities in one place.</p>
      </article>
      <div className="mb-4 flex gap-2">
        <div className="relative w-full">
          <Search size={17} className="absolute left-2 text-neutral-400 top-1/2 -translate-y-1/2" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search by plate number..."
            aria-label="Search by plate number"
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter ?? ''}
          onValueChange={(value) => setColumnFilters(value === '' ? [] : [{ id: 'status', value }])}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading && !data ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : isError && !data ? (
        <InfoCard
          variant="error"
          title="Something went wrong while getting logs"
          subtitle="Click retry to get parking log "
          action={<Button onClick={() => refetch()}>retry</Button>}
        />
      ) : data?.sessions.length === 0 || !data?.sessions ? (
        <section className="flex flex-col justify-center items-center gap-4">
          <ClipboardX size={50} className="text-primary-container" />
          <h2 className="font-semibold">No Parking Logs yet</h2>
          <p className="max-w-[40ch] mx-auto text-center">
            Create a branch and add attendants to capture plates and create logs
          </p>
          <div className="flex gap-2">
            <Link to={Routes.branches}>
              <Button variant={'primary'}>Create Branch</Button>
            </Link>
            <Link to={Routes.employees}>
              <Button variant={'outline'}>Add Attendant</Button>
            </Link>
          </div>
        </section>
      ) : (
        <ParkingLogTable
          parkingLogs={data?.sessions}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          pageCount={Math.ceil((data.total ?? 0) / pagination.pageSize)}
        />
      )}
    </div>
  );
}
