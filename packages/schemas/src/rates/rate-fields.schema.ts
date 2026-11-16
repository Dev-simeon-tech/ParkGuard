import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const RateFieldsSchema = z.object({
  durationMinutes: z
    .number()
    .int(ValidationMessages.DURATION_MINUTES_INVALID)
    .positive(ValidationMessages.DURATION_MINUTES_INVALID),
  pricePerDuration: z
    .number()
    .int(ValidationMessages.PRICE_PER_DURATION_INVALID)
    .nonnegative(ValidationMessages.PRICE_PER_DURATION_INVALID),
  gracePeriodMinutes: z
    .number()
    .int(ValidationMessages.GRACE_PERIOD_INVALID)
    .nonnegative(ValidationMessages.GRACE_PERIOD_INVALID)
    .optional(),
  dailyMaxAmount: z
    .number()
    .int(ValidationMessages.DAILY_MAX_AMOUNT_INVALID)
    .positive(ValidationMessages.DAILY_MAX_AMOUNT_INVALID)
    .optional(),
});

export type RateFields = z.infer<typeof RateFieldsSchema>;
