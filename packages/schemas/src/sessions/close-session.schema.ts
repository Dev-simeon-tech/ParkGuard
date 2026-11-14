import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const CloseSessionBodySchema = z.object({
  photoRef: z.string().optional(),
  confidence: z
    .number()
    .min(0, ValidationMessages.CONFIDENCE_INVALID)
    .max(1, ValidationMessages.CONFIDENCE_INVALID)
    .optional(),
});

export type CloseSessionBody = z.infer<typeof CloseSessionBodySchema>;
