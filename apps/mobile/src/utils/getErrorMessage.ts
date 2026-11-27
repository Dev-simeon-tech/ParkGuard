import { ApiError } from '@/lib/api/client';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}
