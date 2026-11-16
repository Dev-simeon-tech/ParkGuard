import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const AcceptInviteBodySchema = z.object({
  token: z.string().min(1, ValidationMessages.TOKEN_REQUIRED),
  password: z.string().min(8, ValidationMessages.PASSWORD_TOO_SHORT),
});

export type AcceptInviteBody = z.infer<typeof AcceptInviteBodySchema>;
