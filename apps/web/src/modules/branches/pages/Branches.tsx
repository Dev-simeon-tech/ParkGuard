import type { BranchSummary } from '@parkguard/types';
import { useState } from 'react';
import AddBranchIcon from '@/assets/add-branch.svg?react';
import { Button } from '@/components/Button/Button';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Spinner } from '@/components/Spinner';
import { useListBranches } from '../api/listBranches';
import { AddBranchesDialog } from '../components/AddBranchDialog';
import BranchCard from '../components/BranchCard';
import { EditBranchDialog } from '../components/EditBranchDialog';

export const BranchesPage = () => {
  const {
    data: branches,
    isLoading: branchesLoading,
    isError: branchesError,
    refetch,
  } = useListBranches();
  const [editingBranch, setEditingBranch] = useState<BranchSummary | null>(null);
  const isError = branchesError;

  if (isError) {
    return (
      <InfoCard
        variant="error"
        title="Something went wrong while getting branches data"
        subtitle="Click retry to fetch data"
        action={<Button onClick={() => refetch()}>retry</Button>}
      />
    );
  }

  return (
    <div className="flex flex-col max-h-full ">
      <div className="flex justify-between lg:items-center gap-6 flex-col lg:flex-row">
        <article>
          <h2 className="text-2xl lg:text-3xl font-semibold pb-2">Branch Management</h2>
          <p>Create and edit your parking lots branches while configuring the rate options</p>
        </article>
        <AddBranchesDialog />
      </div>

      {branchesLoading ? (
        <section className="flex justify-center items-center mt-20">
          <Spinner />
        </section>
      ) : (
        <>
          {branches?.length === 0 ? (
            <section className="flex-1 flex justify-center mt-20 items-center">
              <div className="border-2 h-[80%] min-h-50 border-outline-variant border-dashed p-10 rounded-2xl text-center flex flex-col justify-center items-center">
                <div className="p-6 bg-grey-variant rounded-full flex justify-center items-center">
                  <AddBranchIcon />
                </div>
                <article className="mt-10">
                  <h3 className="font-bold text-2xl pb-2">Add New Branch</h3>
                  <p className="text-lg">Setup a new location with custom parking rates.</p>
                </article>
              </div>
            </section>
          ) : (
            <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 lg:gap-8 mt-15">
              {branches?.map((branch, index) => (
                <BranchCard key={branch.name + index} branch={branch} onEdit={setEditingBranch} />
              ))}
            </section>
          )}
        </>
      )}

      <EditBranchDialog branch={editingBranch} onClose={() => setEditingBranch(null)} />
    </div>
  );
};
