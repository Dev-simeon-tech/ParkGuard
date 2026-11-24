import type { VehicleDetail } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

export async function getVehicle(id: string): Promise<VehicleDetail> {
  const response = await api.get<{ vehicle: VehicleDetail }>(ApiRoutes.vehicles.get(id));
  return response.data.vehicle;
}

export const useGetVehicle = (id: string) => {
  return useQuery({
    queryKey: queryKeys.vehicles.get(id),
    queryFn: () => getVehicle(id),
  });
};
