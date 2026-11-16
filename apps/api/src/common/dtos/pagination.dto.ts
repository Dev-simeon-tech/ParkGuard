import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(100).default(20),
});

export type Pagination = z.infer<typeof PaginationSchema>;
