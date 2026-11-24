import { ClipboardX, Search } from 'lucide-react';
import { Button } from '@/components/Button';
import { useDataTableState } from '@/components/DataTable';
import { InfoCard } from '@/components/InfoCard';
import { Input } from '@/components/Input';
import { Spinner } from '@/components/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { useListVehicles } from '../api/listVehicles';
import VehiclesTable from '../components/VehiclesTable';

export function VehiclesPage() {
  const { pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter } =
    useDataTableState();
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const { data, isLoading, isError, refetch } = useListVehicles(debouncedGlobalFilter);

  return (
    <section>
      <article className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-semibold pb-2">Parked Vehicle</h2>
        <p>View and manage all the parked vehicles in the system.</p>
      </article>
      <div className="relative mb-4">
        <Search size={17} className="absolute left-2 text-neutral-400 top-1/2 -translate-y-1/2" />
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search by Plate number..."
          aria-label="Search by Plate number"
          className="pl-8"
        />
      </div>
      {isLoading && !data ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : isError && !data ? (
        <InfoCard
          variant="error"
          title="Something went wrong while getting vehicles data"
          subtitle="Click retry to fetch data"
          action={<Button onClick={() => refetch()}>retry</Button>}
        />
      ) : data?.length === 0 && !debouncedGlobalFilter ? (
        <section className="flex flex-col justify-center items-center gap-4">
          <ClipboardX size={50} className="text-primary-container" />
          <h2 className="font-semibold">No Parked Vehicles yet</h2>
          <p className="max-w-[40ch] mx-auto text-center">
            Parked vehicles will be displayed here. Capture a vehicle plate to add it to the system.
          </p>
        </section>
      ) : (
        <VehiclesTable
          vehicles={data ?? []}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}
    </section>
  );
}
