import { VehicleSummary } from '@parkguard/types';
import { ColumnDef, PaginationState, OnChangeFn, SortingState } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useMemo } from 'react';
import { DataTable } from '@/components/DataTable';
import { formatDateTime } from '@/utils/formatDate';
import VehicleDetailsSheet from './VehicleDetailsSheet';

export type VehiclesTableProps = {
  vehicles: VehicleSummary[];
  isLoading?: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
};

export default function VehiclesTable({
  vehicles,
  isLoading,
  pagination,
  onPaginationChange,
  onSortingChange,
  sorting,
}: VehiclesTableProps) {
  const columns = useMemo<ColumnDef<VehicleSummary>[]>(
    () => [
      {
        id: 'plate',
        header: 'Plate Number',
        cell: ({ row }) => (
          <p className="text-primary-container font-bold p-1 w-fit rounded-sm bg-secondary/20">
            {row.original.plateNumber}
          </p>
        ),
      },
      {
        id: 'model',
        header: 'Model',
        accessorKey: 'model',
        cell: ({ row }) => (
          <p className="capitalize  font-semibold">
            {row.original.model ? row.original.model : '-'}
          </p>
        ),
      },
      {
        id: 'color',
        header: 'Color',
        cell: ({ row }) => (
          <p className="flex items-center gap-1">
            <span>{row.original.color ? row.original.color : '-'}</span>
            {row.original.color && (
              <span
                style={{
                  backgroundColor: row.original.color.toLowerCase(),
                }}
                className="h-2 w-2 rounded-full"
              ></span>
            )}
          </p>
        ),
      },

      {
        id: 'created',
        header: 'Created At',
        accessorFn: (vehicle) =>
          `${formatDateTime(vehicle.createdAt).day}, ${formatDateTime(vehicle.createdAt).time}`,
      },
      {
        id: 'updated',
        header: 'Updated At',
        accessorFn: (vehicle) =>
          `${formatDateTime(vehicle.updatedAt).day}, ${formatDateTime(vehicle.updatedAt).time}`,
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (
          <button
            className="cursor-pointer hover:text-secondary flex items-center gap-1"
            onClick={() =>
              (table.options.meta as { onView: (vehicle: VehicleSummary) => void }).onView(
                row.original,
              )
            }
          >
            <Eye size={15} />
            <p className="text-inherit">View</p>
          </button>
        ),
      },
    ],
    [],
  );
  return (
    <DataTable
      columns={columns}
      data={vehicles}
      pagination={pagination}
      sorting={sorting}
      isLoading={isLoading}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      SheetContentElement={VehicleDetailsSheet}
      manualFiltering={true}
      pageCount={Math.ceil((vehicles.length ?? 0) / pagination.pageSize)}
    />
  );
}
