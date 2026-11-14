import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

const MAX_BASE64_IMAGE_LENGTH = 14 * 1024 * 1024;
const DATA_URI_PATTERN = /^data:image\/(?:jpeg|png);base64,/i;

function getBase64Payload(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (!DATA_URI_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed.replace(DATA_URI_PATTERN, '');
}

export const RecognizeSessionBodySchema = z.object({
  branchId: z.uuid(ValidationMessages.UUID_INVALID),
  imageBase64: z
    .string()
    .min(1, ValidationMessages.IMAGE_REQUIRED)
    .max(MAX_BASE64_IMAGE_LENGTH, ValidationMessages.IMAGE_TOO_LARGE)
    .refine((value) => {
      const payload = getBase64Payload(value);
      return Boolean(
        payload
          && payload.length > 0
          && payload.length % 4 === 0
          && /^[A-Za-z0-9+/]+={0,2}$/.test(payload),
      );
    }, ValidationMessages.IMAGE_INVALID),
  mimeType: z.enum(['image/jpeg', 'image/png']).optional(),
});

export type RecognizeSessionBody = z.infer<typeof RecognizeSessionBodySchema>;
