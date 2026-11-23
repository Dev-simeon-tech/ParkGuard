import type { InviteMemberBody } from '@parkguard/schemas';
import type { BranchSummary } from '@parkguard/types';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog';

import { useInviteMember } from '../api/inviteMember';
import { useListRoles } from '../api/listRoles';
import { EmployeeForm } from './EmployeeForm';

export function AddEmployeeDialog({ branches }: { branches: BranchSummary[] }) {
  const [open, setOpen] = useState(false);
  const inviteMutation = useInviteMember();
  const { data: roles = [] } = useListRoles();

  const handleSubmit = async (values: Partial<InviteMemberBody>) => {
    await inviteMutation.mutateAsync({
      email: values.email!,
      firstName: values.firstName!,
      lastName: values.lastName!,
      phoneNumber: values.phoneNumber,
      roleId: values.roleId!,
      branchIds: values.branchIds!,
    });
    setOpen(false);
    toast.success(`Invite link sent successfully to ${values.email}`);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus size={18} />
          <span>Add Employees</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
        </DialogHeader>
        <EmployeeForm
          mode="add"
          roles={roles}
          branches={branches}
          onSubmit={handleSubmit}
          submitLabel="Send invite"
        />
      </DialogContent>
    </Dialog>
  );
}
