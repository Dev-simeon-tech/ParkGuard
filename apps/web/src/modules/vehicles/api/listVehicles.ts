import type { VehicleSummary } from '@parkguard/types';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '@/api';
import { queryKeys } from '@/config/queryKeys';
import { api } from '@/lib/axios';

export async function listVehicles(query?: string): Promise<VehicleSummary[]> {
  if (query) {
    const queryResponse = await api.get<{ vehicles: VehicleSummary[] }>(
      ApiRoutes.vehicles.listQuery(query),
    );
    return queryResponse.data.vehicles;
  } else {
    const response = await api.get<{ vehicles: VehicleSummary[] }>(ApiRoutes.vehicles.list);
    return response.data.vehicles;
  }
}

export const useListVehicles = (query?: string) => {
  return useQuery({
    queryKey: queryKeys.vehicles.list(query),
    queryFn: () => listVehicles(query),
  });
};
