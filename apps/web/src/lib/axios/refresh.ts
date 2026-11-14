import type { AuthResponse } from '@parkguard/types';
import Axios from 'axios';
import { ApiRoutes } from '@/api';
import { API_URL } from '@/config/constants';

export async function refreshSession(): Promise<AuthResponse> {
  const response = await Axios.post<AuthResponse>(
    `${API_URL}${ApiRoutes.auth.refresh}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}
