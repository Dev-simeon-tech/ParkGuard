import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const ForgotPasswordBodySchema = z.object({
  email: z.email(ValidationMessages.EMAIL_INVALID),
});

export type ForgotPasswordBody = z.infer<typeof ForgotPasswordBodySchema>;
