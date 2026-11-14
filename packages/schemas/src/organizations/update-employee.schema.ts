import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const UpdateEmployeeBodySchema = z.object({
  firstName: z.string().min(1, ValidationMessages.FIRST_NAME_REQUIRED).optional(),
  lastName: z.string().min(1, ValidationMessages.LAST_NAME_REQUIRED).optional(),
  phoneNumber: z.string().optional(),
  roleId: z.uuid(ValidationMessages.UUID_INVALID).optional(),
  branchIds: z.uuid(ValidationMessages.UUID_INVALID).array().optional(),
});

export type UpdateEmployeeBody = z.infer<typeof UpdateEmployeeBodySchema>;
