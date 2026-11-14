import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const InviteMemberBodySchema = z.object({
  email: z.email(ValidationMessages.EMAIL_INVALID),
  firstName: z.string().min(1, ValidationMessages.FIRST_NAME_REQUIRED),
  lastName: z.string().min(1, ValidationMessages.LAST_NAME_REQUIRED),
  phoneNumber: z.string().optional(),
  roleId: z.uuid(ValidationMessages.UUID_INVALID),
  branchIds: z.uuid(ValidationMessages.UUID_INVALID).array().optional(),
});

export type InviteMemberBody = z.infer<typeof InviteMemberBodySchema>;
