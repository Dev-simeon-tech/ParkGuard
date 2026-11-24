import { ParkingSessionSummary } from '@parkguard/types';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatNaira } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { formatDuration } from '@/utils/formatDuration';

const ParkingLogSheet = ({ data: session }: { data: ParkingSessionSummary }) => {
  const entryAt = formatDateTime(session.entryAt);
  const exitAt = session.exitAt ? formatDateTime(session.exitAt) : null;
  return (
    <>
      <SheetHeader>
        <SheetTitle>Parking Log Details</SheetTitle>
      </SheetHeader>
      <div className="px-4">
        <div className="bg-neutral-200 py-8 flex gap-2 justify-center flex-col items-center rounded-xl">
          <h2 className="font-mono-label uppercase tracking-wider">Plate Number</h2>
          <p className="md:text-5xl text-2xl font-mono-label text-primary-container">
            {session.vehicle.plateNumber}
          </p>
        </div>
        <div className="flex items-center justify-between capitalize mt-5">
          {session.vehicle.model && (
            <div>
              <h3 className="uppercase text-xs ">Model</h3>
              <p className="capitalize font-bold text-primary-container">{session.vehicle.model}</p>
            </div>
          )}
          {session.vehicle.color && (
            <div>
              <div>
                <h3 className="uppercase text-xs ">color</h3>
                <div className="flex items-center gap-1">
                  <p className="capitalize font-bold text-primary-container">
                    {session.vehicle.color}
                  </p>
                  <div
                    style={{
                      backgroundColor: session.vehicle.color.toLowerCase(),
                    }}
                    className="h-2 w-2 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-10 border-t grid grid-cols-2 border-neutral-200 gap-4   pt-4">
          <div>
            <h3 className="uppercase text-xs">Status</h3>
            <p
              className={`capitalize font-bold ${session.status === 'active' ? 'text-green-400' : 'text-neutral-500'}`}
            >
              {session.status}
            </p>
          </div>
          <div>
            <h3 className="uppercase text-xs">branch</h3>
            <p className="capitalize font-bold text-primary-container">{session.branch.name}</p>
          </div>
          <div>
            <h3 className="uppercase text-xs">entry logged by</h3>
            <p className="capitalize font-bold text-primary-container">
              {session.entryRecordedBy?.firstName} {session.entryRecordedBy?.lastName}
            </p>
          </div>
          {session.exitRecordedBy && (
            <div>
              <h3 className="uppercase text-xs">exit logged by</h3>
              <p className="capitalize font-bold text-primary-container">
                {session.exitRecordedBy?.firstName} {session.exitRecordedBy?.lastName}
              </p>
            </div>
          )}

          <div>
            <h3 className="uppercase text-xs">entry at</h3>
            <p className="capitalize font-bold text-primary-container">
              {entryAt.day}, {entryAt.time}
            </p>
          </div>
          {exitAt && (
            <div>
              <h3 className="uppercase text-xs">exit at</h3>
              <p className="capitalize font-bold text-primary-container">
                {exitAt.day}, {exitAt.time}
              </p>
            </div>
          )}
          {session.durationMinutes && (
            <div>
              <h3 className="uppercase text-xs">duration</h3>
              <p className="capitalize font-bold text-primary-container">
                {formatDuration(session.durationMinutes)}
              </p>
            </div>
          )}
          {session.totalAmount !== null && (
            <div>
              <h3 className="uppercase text-xs">total amount</h3>
              <p className="capitalize font-bold text-secondary">
                {formatNaira(session.totalAmount)}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ParkingLogSheet;
