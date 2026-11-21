import type { ColumnDef, OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { cn } from '@/utils/cn';
import { Sheet, SheetContent } from '../ui/sheet';

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
  SheetContentElement?: ComponentType<{ data: TData }>;
};

export function DataTable<TData>({
  columns,
  data,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading = false,
  SheetContentElement,
}: DataTableProps<TData>) {
  const [selected, setSelected] = useState<TData | null>(null);
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange,
    onSortingChange,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount: manualPagination ? (pageCount ?? -1) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    meta: { onView: (data: TData) => window.setTimeout(() => setSelected(data), 0) },
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
  });

  return (
    <div className="space-y-3 border shadow-md overflow-hidden border-outline-variant rounded-xl">
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(canSort && 'cursor-pointer select-none')}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : null}
                        </span>
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-neutral-500">
                Loading…
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-neutral-500">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-3 pr-4 pb-2">
        <span className="text-sm text-neutral-500">
          Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      {SheetContentElement && (
        <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent>
            {selected !== null && <SheetContentElement data={selected} />}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
