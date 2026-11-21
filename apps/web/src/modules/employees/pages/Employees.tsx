import type { OrganizationMember } from '@parkguard/types';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDataTableState } from '@/components/DataTable';
import { Input } from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { useListBranches } from '@/modules/employees/api/listBranches';
import { useListEmployees } from '../api/listEmployees';
import { useListRoles } from '../api/listRoles';
import { AddEmployeeDialog } from '../components/AddEmployeeDialog';
import { DeleteEmployeeAlertDialog } from '../components/DeleteEmployeeAlertDialog';
import { EditEmployeeDialog } from '../components/EditEmployeeDialog';
import { EmployeesTable } from '../components/EmployeesTable';
import type { StatusFilter, RoleFilter } from '../types';

export function EmployeesPage() {
  const { data: employees = [], isLoading } = useListEmployees();
  const { data: branches = [] } = useListBranches();
  const { data: roles = [] } = useListRoles();
  const { pagination, setPagination, sorting, setSorting } = useDataTableState();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [searchValue, setSearchValue] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<OrganizationMember | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<OrganizationMember | null>(null);

  const filteredEmployees = useMemo(() => {
    if (statusFilter === 'all' && !searchValue && roleFilter === 'all') {
      return employees;
    }
    // return employees.filter((employee) =>
    //   statusFilter === 'disabled' ? Boolean(employee.disabledAt) : !employee.disabledAt,
    // );

    return employees.filter((employee) => {
      const fullName = employee.user.firstName + employee.user.lastName;
      return (
        fullName.toLowerCase().includes(searchValue.toLowerCase()) &&
        (roleFilter === 'all' || employee.role === roleFilter) &&
        (statusFilter === 'all' ||
          (statusFilter === 'disabled' && Boolean(employee.disabledAt)) ||
          (statusFilter === 'active' && !employee.disabledAt))
      );
    });
  }, [employees, statusFilter, searchValue, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between mb-15">
        <article>
          <h1 className="text-xl lg:text-3xl font-semibold pb-2">Employees</h1>
          <p>Create, Manage and Monitor employees in your Organisation.</p>
        </article>
        <AddEmployeeDialog branches={branches} />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
        <div className="relative h-full w-full lg:flex-1 ">
          <Search size={17} className="absolute left-2 text-neutral-400 top-1/2 -translate-y-1/2" />
          <Input
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-full pl-8  outline-0"
            placeholder="Search by name..."
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="auditor">Auditor</SelectItem>
              <SelectItem value="attendant">Attendant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <EmployeesTable
        employees={filteredEmployees}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        onEdit={setEditingEmployee}
        onDelete={setDeletingEmployee}
      />

      <EditEmployeeDialog
        employee={editingEmployee}
        branches={branches}
        roles={roles}
        onClose={() => setEditingEmployee(null)}
      />
      <DeleteEmployeeAlertDialog
        employee={deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
      />
    </div>
  );
}
