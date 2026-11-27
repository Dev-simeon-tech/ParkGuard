import type { AuthResponse } from '@parkguard/types';
import { ApiRoutes } from '@/api/routes';
import { getAccessToken, setAccessToken } from './token-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const AUTH_PATHS: string[] = Object.values(ApiRoutes.auth);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type SessionHandlers = {
  refresh: () => Promise<AuthResponse>;
  onRefreshed: (session: AuthResponse) => void;
  onExpired: () => void;
};

let sessionHandlers: SessionHandlers | null = null;

export function setSessionHandlers(handlers: SessionHandlers): void {
  sessionHandlers = handlers;
}

let isRefreshing = false;
let pendingRequests: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

async function refreshAccessToken(): Promise<string> {
  if (!sessionHandlers) {
    throw new ApiError(401, 'Not authenticated');
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const session = await sessionHandlers.refresh();
    setAccessToken(session.accessToken);
    sessionHandlers.onRefreshed(session);
    pendingRequests.forEach((request) => request.resolve(session.accessToken));
    pendingRequests = [];
    return session.accessToken;
  } catch (error) {
    setAccessToken(null);
    pendingRequests.forEach((request) => request.reject(error));
    pendingRequests = [];
    sessionHandlers.onExpired();
    throw error;
  } finally {
    isRefreshing = false;
  }
}

async function parseJsonBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function throwIfNotOk(response: Response): Promise<void> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error?.message ?? 'Something went wrong');
  }
}

type ApiFetchInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };

export async function apiFetch<T>(path: string, init?: ApiFetchInit, isRetry = false): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...init?.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (response.status === 401 && !isRetry && !AUTH_PATHS.includes(path) && sessionHandlers) {
    await refreshAccessToken();
    return apiFetch<T>(path, init, true);
  }

  await throwIfNotOk(response);
  return parseJsonBody<T>(response);
}
