import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { queryKeys } from '@/config/queryKeys';
import { Routes } from '@/config/routes';
import { queryClient } from '@/lib/react-query';
import { api } from './index';
import { refreshSession } from './refresh';
import { getAccessToken, setAccessToken } from './token-store';

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type FailedRequestQueueItem = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueItem[] = [];

function redirectToLogin(): void {
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.href = `${Routes.login}?redirect=${encodeURIComponent(currentPath)}`;
}

function handleRefreshToken(): void {
  isRefreshing = true;

  refreshSession()
    .then((data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), data);
      failedRequestQueue.forEach((request) => request.onSuccess(data.accessToken));
      failedRequestQueue = [];
    })
    .catch((error: AxiosError) => {
      setAccessToken(null);
      queryClient.setQueryData(queryKeys.auth.session(), null);
      failedRequestQueue.forEach((request) => request.onFailure(error));
      failedRequestQueue = [];
      redirectToLogin();
    })
    .finally(() => {
      isRefreshing = false;
    });
}

export function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

export async function onResponseError(
  error: AxiosError,
): Promise<AxiosError | AxiosResponse> {
  const originalConfig = error.config as CustomAxiosRequestConfig | undefined;

  if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
    originalConfig._retry = true;

    if (!isRefreshing) {
      handleRefreshToken();
    }

    return new Promise((resolve, reject) => {
      failedRequestQueue.push({
        onSuccess: (token: string) => {
          originalConfig.headers.set('Authorization', `Bearer ${token}`);
          resolve(api(originalConfig));
        },
        onFailure: (queueError: AxiosError) => {
          reject(queueError);
        },
      });
    });
  }

  return Promise.reject(error);
}
