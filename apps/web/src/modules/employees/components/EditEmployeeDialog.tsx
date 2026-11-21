import type { InviteMemberBody } from '@parkguard/schemas';
import type { OrganizationMember, RoleSummary, BranchSummary } from '@parkguard/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog';
import { EmployeeForm } from './EmployeeForm';
import { useUpdateEmployee } from '../api/updateEmployee';

export type EditEmployeeDialogProps = {
  employee: OrganizationMember | null;
  roles: RoleSummary[];
  branches: BranchSummary[];
  onClose: () => void;
};

export function EditEmployeeDialog({
  employee,
  roles,
  onClose,
  branches,
}: EditEmployeeDialogProps) {
  const updateMutation = useUpdateEmployee();

  if (!employee || roles.length === 0) {
    return null;
  }

  const currentRole = roles.find((role) => role.name === employee.role);

  const handleSubmit = async (values: Partial<InviteMemberBody>) => {
    await updateMutation.mutateAsync({
      id: employee.id,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      roleId: values.roleId,
    });
    onClose();
  };

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit employee</DialogTitle>
        </DialogHeader>
        <EmployeeForm
          mode="edit"
          branches={branches}
          roles={roles}
          defaultValues={{
            firstName: employee.user.firstName,
            lastName: employee.user.lastName,
            phoneNumber: employee.user.phoneNumber ?? '',
            roleId: currentRole?.id,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}
