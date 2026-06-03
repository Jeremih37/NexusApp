import { z } from 'zod/v4'

export const gameQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  sort: z.enum(['rating', 'newest', 'name']).default('rating'),
})
