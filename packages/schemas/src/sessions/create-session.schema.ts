import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const CreateSessionBodySchema = z.object({
  branchId: z.uuid(ValidationMessages.UUID_INVALID),
  plateNumber: z.string().min(1, ValidationMessages.PLATE_NUMBER_REQUIRED),
  color: z.string().optional(),
  model: z.string().optional(),
  photoRef: z.string().optional(),
  confidence: z
    .number()
    .min(0, ValidationMessages.CONFIDENCE_INVALID)
    .max(1, ValidationMessages.CONFIDENCE_INVALID)
    .optional(),
});

export type CreateSessionBody = z.infer<typeof CreateSessionBodySchema>;
