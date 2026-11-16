import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const ResendVerificationBodySchema = z.object({
  email: z.email(ValidationMessages.EMAIL_INVALID),
});

export type ResendVerificationBody = z.infer<typeof ResendVerificationBodySchema>;
