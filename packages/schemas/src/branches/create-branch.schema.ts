import { z } from 'zod';
import { RateFieldsSchema } from '../rates';
import { ValidationMessages } from '../validation-messages';

export const CreateBranchBodySchema = z.object({
  name: z.string().min(1, ValidationMessages.BRANCH_NAME_REQUIRED),
  state: z.string().min(1, ValidationMessages.STATE_REQUIRED),
  address: z.string().min(1, ValidationMessages.ADDRESS_REQUIRED),
  totalCapacity: z
    .number()
    .int(ValidationMessages.TOTAL_CAPACITY_INVALID)
    .positive(ValidationMessages.TOTAL_CAPACITY_INVALID),
  rate: RateFieldsSchema,
});

export type CreateBranchBody = z.infer<typeof CreateBranchBodySchema>;
