import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const LoginBodySchema = z.object({
  email: z.email(ValidationMessages.EMAIL_INVALID),
  password: z.string().min(1, ValidationMessages.PASSWORD_REQUIRED),
  scope: z.literal('mobile').optional(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
