import type { OrganizationMember } from '@parkguard/types';
import type { ColumnDef, OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { EllipsisVertical, SquarePen, Trash, Ban, UserRoundCheck, Activity } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/Badge';
import { ButtonDropdown } from '@/components/ButtonDropdown';
import { DataTable } from '@/components/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { useDisableEmployee } from '../api/disableEmployee';
import { useEnableEmployee } from '../api/enableEmployee';
import { formatRoleName, roleBadgeVariants } from '../utils';
import EmployeeActivitySheet from './EmployeeActivitySheet';

export type EmployeesTableProps = {
  employees: OrganizationMember[];
  isLoading?: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onEdit: (employee: OrganizationMember) => void;
  onDelete: (employee: OrganizationMember) => void;
};

export function EmployeesTable({
  employees,
  isLoading,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  const { user } = useAuth();
  const disableMutation = useDisableEmployee();
  const enableMutation = useEnableEmployee();

  const columns = useMemo<ColumnDef<OrganizationMember>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorFn: (employee) => `${employee.user.firstName} ${employee.user.lastName}`,
      },
      {
        id: 'email',
        header: 'Email',
        accessorFn: (employee) => employee.user.email,
      },
      {
        id: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge className={`${roleBadgeVariants[row.original.role]} text-white`}>
            {formatRoleName(row.original.role)}
          </Badge>
        ),
      },
      {
        id: 'branch',
        header: 'Branch',
        accessorFn: (employee) => employee.branches[0]?.name ?? '-',
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.disabledAt ? 'destructive' : 'success'}>
            {row.original.disabledAt ? 'Disabled' : 'Active'}
          </Badge>
        ),
      },
      {
        id: 'joined',
        header: 'Joined',
        cell: ({ row }) =>
          row.original.acceptedAt ? (
            new Date(row.original.acceptedAt).toLocaleDateString()
          ) : (
            <Badge variant={'pending'}>Pending</Badge>
          ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row, table }) => {
          const employee = row.original;
          const isSelf = employee.user.id === user?.id;
          const isAttendant = employee.role === 'attendant';
          const disableOrEnableItem = employee.disabledAt
            ? {
                label: 'Enable',
                onClick: () => enableMutation.mutate(employee.id),
                icon: UserRoundCheck,
              }
            : { label: 'Disable', onClick: () => disableMutation.mutate(employee.id), icon: Ban };
          return (
            <ButtonDropdown
              triggerLabel={<EllipsisVertical />}
              buttonVariantType={null}
              items={[
                { label: 'Edit', onClick: () => onEdit(employee), icon: SquarePen },
                ...(isSelf ? [] : [disableOrEnableItem]),
                ...(isSelf
                  ? []
                  : [
                      {
                        label: 'Delete',
                        onClick: () => onDelete(employee),
                        destructive: true,
                        icon: Trash,
                      },
                    ]),
                ...(!isAttendant
                  ? []
                  : [
                      {
                        label: 'View Activity',
                        icon: Activity,
                        onClick: () =>
                          (
                            table.options.meta as { onView: (employee: OrganizationMember) => void }
                          ).onView(row.original),
                      },
                    ]),
              ]}
            />
          );
        },
      },
    ],
    [disableMutation, enableMutation, onDelete, onEdit, user?.id],
  );

  return (
    <DataTable
      columns={columns}
      data={employees}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      sorting={sorting}
      onSortingChange={onSortingChange}
      SheetContentElement={EmployeeActivitySheet}
      pageCount={Math.ceil((employees.length ?? 0) / pagination.pageSize)}
    />
  );
}
