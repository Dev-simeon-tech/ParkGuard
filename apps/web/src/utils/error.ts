import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message;
    if (message) {
      return message;
    }
  }
  return fallback;
}
