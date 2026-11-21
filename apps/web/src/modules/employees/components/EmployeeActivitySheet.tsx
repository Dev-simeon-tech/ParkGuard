import { OrganizationMember } from '@parkguard/types';
import { User, RotateCcw } from 'lucide-react';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDateTime } from '@/utils/formatDate';
import { useGetEmployeeActivities } from '../api/getEmployeeActivity';

const EmployeeActivitySheet = ({ data: attendant }: { data: OrganizationMember }) => {
  const {
    data: activities,
    isLoading,
    isError,
    refetch,
  } = useGetEmployeeActivities({
    date: new Date().toISOString().split('T')[0],
    userId: attendant.user.id,
  });

  if (isError || !activities) {
    return (
      <div className="h-full flex justify-center items-center">
        <InfoCard
          variant="error"
          title="Something went wrong"
          subtitle="An error occured while fetching Attendants activities"
          action={
            <Button className="gap-2" size={'sm'} onClick={() => refetch}>
              <RotateCcw size={20} />
              <p className="text-white">Retry</p>
            </Button>
          }
        />
      </div>
    );
  }
  return (
    <>
      <SheetHeader>
        <SheetTitle>Attendant Activities</SheetTitle>
      </SheetHeader>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <section className="px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex justify-center items-center">
              <User size={40} />
            </div>
            <p className="capitalize font-semibold">
              {attendant.user.firstName} {attendant.user.lastName}
            </p>
          </div>
          <div className="flex gap-3 mt-5">
            <div className="py-3 px-4 flex-1 bg-neutral-100 rounded-md">
              <h3 className="text-xs capitalize">Total Cars In Today</h3>
              <p className="text-lg font-bold text-secondary">{activities?.totalCarsIn}</p>
            </div>
            <div className="py-3 px-4 flex-1 bg-neutral-100 rounded-md">
              <h3 className="text-xs capitalize">Total Cars Out Today</h3>
              <p className="text-lg font-bold text-secondary">{activities?.totalCarsOut}</p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className=" font-mono-label">Recent Parking Sessions</h3>
            {activities.recentSessions.length === 0 ? (
              <p className="text-center mt-10">No recent sessions</p>
            ) : (
              <div className="mt-5">
                {activities.recentSessions.map((session) => (
                  <div key={session.id} className="flex gap-2 items-center pb-3">
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex relative justify-center items-center after:content-[''] after:translate-x-1/2 after:absolute after:top-full after:w-1 after:border-l after:border-black after:h-8 ${session.status === 'active' ? 'border-green-400' : 'border-neutral-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full justify-self-center ${session.status === 'active' ? 'bg-green-400' : 'bg-neutral-400'}`}
                      ></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {session.vehicle.plateNumber}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {session.status === 'completed' && session.exitAt ? (
                          <>
                            {`exit at: ${formatDateTime(session.exitAt).day}, ${formatDateTime(session.exitAt).time}`}
                          </>
                        ) : (
                          <>
                            {`entry at: ${formatDateTime(session.entryAt).day}, ${formatDateTime(session.entryAt).time}`}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default EmployeeActivitySheet;
