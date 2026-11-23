import type { CreateBranchBody, UpdateBranchBody } from '@parkguard/schemas';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog';
import { useCreateBranch } from '../api/createBranch';
import { BranchForm } from './BranchForm';

export function AddBranchesDialog() {
  const [open, setOpen] = useState(false);
  const branchMutation = useCreateBranch();

  const handleSubmit = async (values: CreateBranchBody | UpdateBranchBody) => {
    await branchMutation.mutateAsync({
      name: values.name!,
      state: values.state!,
      address: values.address!,
      totalCapacity: values.totalCapacity!,
      rate: {
        durationMinutes: values.rate?.durationMinutes ?? 0,
        pricePerDuration: values.rate?.pricePerDuration ?? 0,
        dailyMaxAmount: values.rate?.dailyMaxAmount ?? undefined,
        gracePeriodMinutes: values.rate?.gracePeriodMinutes ?? 0,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          <span>Add Branch</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Branch</DialogTitle>
        </DialogHeader>
        <BranchForm mode="add" onSubmit={handleSubmit} submitLabel="add branch" />
      </DialogContent>
    </Dialog>
  );
}
