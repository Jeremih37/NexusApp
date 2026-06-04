import { z } from 'zod/v4'

export const userQuerySchema = z.object({
  email: z.string().email().optional(),
})
