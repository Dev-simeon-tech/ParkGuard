import { toast } from 'sonner';
import { getErrorMessage } from './error';

export function handleApiError(error: unknown, fallback?: string): void {
  toast.error(getErrorMessage(error, fallback));
}
