import { VehicleSummary } from '@parkguard/types';
import { CarFront } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatNaira } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { useGetVehicle } from '../api/getVehicle';

const VehicleDetailsSheet = ({ data: vehicle }: { data: VehicleSummary }) => {
  const { data: vehicleDetails, isLoading } = useGetVehicle(vehicle.id);
  if (isLoading || !vehicleDetails) {
    return <Spinner />;
  }
  const lastSeenTime = vehicleDetails.lastSeenAt
    ? formatDateTime(vehicleDetails.lastSeenAt)
    : undefined;
  return (
    <>
      <SheetHeader>
        <SheetTitle>Vehicle Details</SheetTitle>
      </SheetHeader>
      <div className="px-4">
        <div className="p-2 rounded-md bg-secondary/20 w-fit mb-5">
          <CarFront size={30} className="text-secondary" />
        </div>

        <div className="bg-neutral-100 py-8 flex gap-2 justify-center flex-col items-center rounded-xl">
          <h2 className="font-mono-label uppercase tracking-wider">Plate Number</h2>
          <p className="text-5xl font-mono-label text-primary-container">{vehicle.plateNumber}</p>
        </div>
        <div className="flex gap-3 mt-5">
          <div className="py-3 px-4 flex-1 bg-neutral-100 rounded-md">
            <h3 className="text-xs capitalize">Total vist</h3>
            <p className="text-lg font-bold text-secondary">{vehicleDetails.visitCount}</p>
          </div>
          <div className="py-3 px-4 flex-1 bg-neutral-100 rounded-md">
            <h3 className="text-xs capitalize">Last Seen</h3>
            <p className="text-base font-bold text-secondary">
              {lastSeenTime ? `${lastSeenTime.day}, ${lastSeenTime.time}` : '-'}
            </p>
          </div>
        </div>
        <div className="border-t-2 border-neutral-200 mt-10 pt-2 flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="capitalize text-neutral-500 text-sm">model</h3>
            <p className="text-primary-container font-bold">
              {vehicle.model ? vehicle.model : '-'}
            </p>
          </div>
          <div className="flex justify-between">
            <h3 className="capitalize text-neutral-500 text-sm">color</h3>
            <p className="text-primary-container font-bold">
              {vehicle.color ? vehicle.color : '-'}
            </p>
          </div>
          <div className="flex justify-between">
            <h3 className="capitalize text-neutral-500 text-sm">Total Billed</h3>
            <p className="text-secondary font-bold">
              {vehicleDetails.totalBilled ? formatNaira(vehicleDetails.totalBilled) : '-'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailsSheet;
