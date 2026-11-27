import Toast from 'react-native-toast-message';
import { getErrorMessage } from './getErrorMessage';

export function handleApiError(error: unknown, fallback?: string): void {
  Toast.show({ type: 'error', text1: getErrorMessage(error, fallback) });
}
