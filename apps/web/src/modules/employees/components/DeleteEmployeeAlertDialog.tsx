import type { OrganizationMember } from '@parkguard/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/AlertDialog';
import { useRemoveEmployee } from '../api/removeEmployee';

export type DeleteEmployeeAlertDialogProps = {
  employee: OrganizationMember | null;
  onClose: () => void;
};

export function DeleteEmployeeAlertDialog({ employee, onClose }: DeleteEmployeeAlertDialogProps) {
  const removeMutation = useRemoveEmployee();

  if (!employee) {
    return null;
  }

  const handleConfirm = async () => {
    await removeMutation.mutateAsync(employee.id);
    onClose();
  };

  return (
    <AlertDialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {employee.user.firstName} {employee.user.lastName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This removes them from the organization. Their account record is kept.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
