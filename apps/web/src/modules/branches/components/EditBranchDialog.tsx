import type { UpdateBranchBody } from '@parkguard/schemas';
import type { BranchSummary } from '@parkguard/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog';
import { useUpdateBranch } from '../api/updateBranch';
import { BranchForm } from './BranchForm';

export type EditBranchDialogProps = {
  branch: BranchSummary | null;
  onClose: () => void;
};

export function EditBranchDialog({ branch, onClose }: EditBranchDialogProps) {
  const updateBranchMutation = useUpdateBranch();

  if (!branch) return null;

  const handleSubmit = async (values: UpdateBranchBody) => {
    await updateBranchMutation.mutateAsync({
      id: branch?.id ?? '',
      name: values.name,
      state: values.state,
      address: values.address,
      totalCapacity: values.totalCapacity,
      rate: {
        durationMinutes: values.rate?.durationMinutes,
        pricePerDuration: values.rate?.pricePerDuration,
        gracePeriodMinutes: values.rate?.gracePeriodMinutes ?? 0,
        dailyMaxAmount: values.rate?.dailyMaxAmount,
      },
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
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <BranchForm
          mode="edit"
          onSubmit={handleSubmit}
          submitLabel="edit branch"
          defaultValues={{
            name: branch.name,
            address: branch.address,
            state: branch.state,
            totalCapacity: branch.totalCapacity,
            rate: {
              dailyMaxAmount: branch.rate.dailyMaxAmount,
              gracePeriodMinutes: branch.rate.gracePeriodMinutes ?? 0,
              pricePerDuration: branch.rate.pricePerDuration,
              durationMinutes: branch.rate.durationMinutes,
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
