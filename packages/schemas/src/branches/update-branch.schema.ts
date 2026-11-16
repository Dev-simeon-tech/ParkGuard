import { z } from 'zod';
import { RateFieldsSchema } from '../rates';
import { ValidationMessages } from '../validation-messages';

export const UpdateBranchBodySchema = z.object({
  name: z.string().min(1, ValidationMessages.BRANCH_NAME_REQUIRED).optional(),
  state: z.string().min(1, ValidationMessages.STATE_REQUIRED).optional(),
  address: z.string().min(1, ValidationMessages.ADDRESS_REQUIRED).optional(),
  totalCapacity: z
    .number()
    .int(ValidationMessages.TOTAL_CAPACITY_INVALID)
    .positive(ValidationMessages.TOTAL_CAPACITY_INVALID)
    .optional(),
  rate: RateFieldsSchema.partial().optional(),
});

export type UpdateBranchBody = z.infer<typeof UpdateBranchBodySchema>;
