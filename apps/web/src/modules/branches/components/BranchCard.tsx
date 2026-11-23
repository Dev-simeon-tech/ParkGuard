import { BranchSummary } from '@parkguard/types';
import { Pencil, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Label } from '@/components/Label';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useDisableBranch } from '../api/disableBranch';
import { useEnableBranch } from '../api/enableBranch';

type BranchCardProps = {
  branch: BranchSummary;
  onEdit: (branch: BranchSummary) => void;
};

const BranchCard = ({ branch, onEdit }: BranchCardProps) => {
  const { id, name, state, status, address, totalCapacity } = branch;
  const currentlyParked = branch.totalActiveSessions;
  const [isActive, setIsActive] = useState(status === 'active' ? true : false);
  const disableMutation = useDisableBranch();
  const enableMutation = useEnableBranch();

  const handleBranchStatus = async () => {
    if (isActive) {
      await disableMutation.mutateAsync(id);
      setIsActive(false);
    } else {
      await enableMutation.mutateAsync(id);
      setIsActive(true);
    }
  };
  const progressPercentage = Math.round((currentlyParked / totalCapacity) * 100);
  return (
    <div className="p-4 lg:p-6 border-2 rounded-2xl bg-white">
      <Badge
        className={`capitalize ${status === 'active' ? 'bg-secondary text-white' : 'bg-inactive text-on-surface-variant'}`}
      >
        {status}
      </Badge>
      <article className="mt-5">
        <h2 className="uppercase text-2xl font-bold">{name}</h2>
        <p className="text-sm flex items-center gap-1 capitalize">
          <MapPin size={16} />
          <span>
            {address}, {state}
          </span>
        </p>
      </article>

      <section className=" my-10 py-10 border-y border-outline-variant">
        <div className="flex gap-2 flex-col lg:flex-row justify-between">
          <div>
            <h3 className="text-on-surface-variant text-body text-sm font-semibold pb-1 tracking-wider uppercase">
              Attendants
            </h3>
            <p className="font-bold text-tertiary">{branch.totalMembers} members</p>
          </div>
          <div>
            <h3 className="text-on-surface-variant text-body tracking-wider pb-1 font-semibold text-sm uppercase">
              Capacity
            </h3>
            <p className="font-bold text-tertiary">{totalCapacity} slot</p>
          </div>
        </div>
        <div className="bg-grey-variant p-3 rounded-md mt-5">
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="progress-upload">
              <span className="text-on-surface-variant font-semibold">Cars Parked Now</span>
              <span className="ml-auto font-bold">
                {currentlyParked} / {totalCapacity}
              </span>
            </FieldLabel>
            <Progress className="h-2" value={progressPercentage} id="progress-upload" />
          </Field>
        </div>
        <div className="flex justify-between mt-5">
          <p className="text-sm">Rate</p>
          <p className="text-secondary font-bold">₦{branch.rate?.pricePerDuration}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm">Grace Period</p>
          <p className="font-bold">{branch.rate?.gracePeriodMinutes} mins</p>
        </div>
        {branch.rate?.dailyMaxAmount && (
          <div className="flex justify-between mt-2">
            <p className="text-sm">Daily maximum cap</p>
            <p className=" font-bold">₦{branch.rate?.dailyMaxAmount}</p>
          </div>
        )}
        {branch.rate?.durationMinutes && (
          <div className="flex justify-between mt-2">
            <p className="text-sm">Charge by Minutes</p>
            <p className="font-bold">{branch.rate?.durationMinutes} mins</p>
          </div>
        )}
      </section>

      <footer className="flex justify-between gap-2">
        <button className="cursor-pointer" onClick={() => onEdit(branch)}>
          <Pencil />
        </button>

        <div className="flex items-center space-x-2">
          <Label htmlFor="status">{status === 'active' ? 'Deactivate' : 'Activate'}</Label>
          <Switch
            className="cursor-pointer"
            onCheckedChange={handleBranchStatus}
            checked={isActive}
            id="status"
          />
        </div>
      </footer>
    </div>
  );
};

export default BranchCard;
