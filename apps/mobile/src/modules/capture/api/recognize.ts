import type { RecognizeSessionBody } from '@parkguard/schemas';
import type { PlateRecognitionResponse } from '@parkguard/types';
import { useMutation } from '@tanstack/react-query';
import { ApiRoutes } from '@/api/routes';
import { apiFetch } from '@/lib/api/client';

export function recognizePlate(input: RecognizeSessionBody): Promise<PlateRecognitionResponse> {
  return apiFetch<PlateRecognitionResponse>(ApiRoutes.sessions.recognize, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function useRecognizePlate() {
  return useMutation({ mutationFn: recognizePlate });
}
