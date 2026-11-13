import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const RegisterBodySchema = z.object({
  firstName: z.string().min(1, ValidationMessages.FIRST_NAME_REQUIRED),
  lastName: z.string().min(1, ValidationMessages.LAST_NAME_REQUIRED),
  email: z.email(ValidationMessages.EMAIL_INVALID),
  password: z.string().min(8, ValidationMessages.PASSWORD_TOO_SHORT),
  businessName: z.string().min(1, ValidationMessages.BUSINESS_NAME_REQUIRED),
  phoneNumber: z.string().optional(),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
