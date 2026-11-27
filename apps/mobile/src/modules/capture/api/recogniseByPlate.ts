import type { PlateRecognitionResponse } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { apiFetch } from '@/lib/api/client';

type RecogniseByPlateInput = {
  plateNumber: string;
  branchId: string;
};

export function recogniseByPlate(input: RecogniseByPlateInput): Promise<PlateRecognitionResponse> {
  return apiFetch<PlateRecognitionResponse>(ApiRoutes.sessions.recogniseByPlate, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function useRecogniseByPlate() {
  return useMutation({ mutationFn: recogniseByPlate });
}
