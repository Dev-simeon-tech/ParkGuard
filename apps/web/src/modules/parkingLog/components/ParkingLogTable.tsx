import { ParkingSessionSummary } from '@parkguard/types';
import { ColumnDef, PaginationState, OnChangeFn, SortingState } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/Badge';
import { DataTable } from '@/components/DataTable';
import { formatNaira } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import ParkingLogSheet from './ParkingLogSheet';
import { getConfidenceLevel } from '../utils';

export type ParkingLogTableProps = {
  parkingLogs: ParkingSessionSummary[];
  isLoading?: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pageCount: number;
};

export default function ParkingLogTable({
  parkingLogs,
  isLoading,
  pagination,
  onPaginationChange,
  onSortingChange,
  sorting,
  pageCount,
}: ParkingLogTableProps) {
  const columns = useMemo<ColumnDef<ParkingSessionSummary>[]>(
    () => [
      {
        id: 'plate',
        header: 'Plate Number',
        cell: ({ row }) => (
          <p className="text-primary-container font-bold p-1 w-fit rounded-sm bg-secondary/20">
            {row.original.vehicle.plateNumber}
          </p>
        ),
      },
      {
        id: 'model',
        header: 'Model',
        cell: ({ row }) => (
          <p className="capitalize  font-semibold">
            {row.original.vehicle.model ? row.original.vehicle.model : '-'}
          </p>
        ),
      },
      {
        id: 'color',
        header: 'Color',
        accessorFn: (session) => (session.vehicle.color ? `${session.vehicle.color}` : '-'),
      },

      {
        id: 'entryConfidence',
        header: 'Entry Confidence',
        cell: ({ row }) => (
          <p
            className={`${getConfidenceLevel(row.original.entryConfidence ? row.original.entryConfidence : 0.0) === 'High' ? 'text-green-500' : 'text-orange-500'} font-semibold`}
          >
            {row.original.entryConfidence !== null
              ? `${Math.floor(row.original.entryConfidence * 100)}%`
              : '-'}
          </p>
        ),
      },
      {
        id: 'exitConfidence',
        header: 'Exit Confidence',
        cell: ({ row }) => (
          <p
            className={`${getConfidenceLevel(row.original.exitConfidence ? row.original.exitConfidence : 0.0) === 'High' ? 'text-green-500' : 'text-orange-500'} font-semibold`}
          >
            {row.original.exitConfidence !== null
              ? `${Math.floor(row.original.exitConfidence * 100)}%`
              : '-'}
          </p>
        ),
      },
      {
        id: 'entry',
        header: 'Entry Time',
        accessorFn: (session) =>
          `${formatDateTime(session.entryAt).day}, ${formatDateTime(session.entryAt).time}`,
      },
      {
        id: 'exit',
        header: 'Exit Time',
        accessorFn: (session) =>
          session.exitAt
            ? `${formatDateTime(session.exitAt).day}, ${formatDateTime(session.exitAt).time}`
            : '-',
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'active' ? 'success' : 'default'}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'amount',
        header: 'Total Amount',
        cell: ({ row }) => (
          <p className="text-secondary font-bold">
            {row.original.totalAmount !== null ? formatNaira(row.original.totalAmount) : '-'}
          </p>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (
          <button
            className="cursor-pointer hover:text-secondary flex items-center gap-1"
            onClick={() =>
              (table.options.meta as { onView: (session: ParkingSessionSummary) => void }).onView(
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
      data={parkingLogs}
      pagination={pagination}
      sorting={sorting}
      isLoading={isLoading}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      SheetContentElement={ParkingLogSheet}
      pageCount={pageCount}
      manualPagination={true}
      manualFiltering={true}
    />
  );
}
