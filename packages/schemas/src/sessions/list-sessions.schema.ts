import { z } from 'zod';
import { ValidationMessages } from '../validation-messages';

export const ListSessionsQuerySchema = z.object({
  status: z.enum(['active', 'completed']).optional(),
  branchId: z.uuid(ValidationMessages.UUID_INVALID).optional(),
  dateFrom: z.iso.date(ValidationMessages.DATE_INVALID).optional(),
  dateTo: z.iso.date(ValidationMessages.DATE_INVALID).optional(),
  plateNumber: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type ListSessionsQuery = z.infer<typeof ListSessionsQuerySchema>;
