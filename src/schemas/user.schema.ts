import { z } from 'zod/v4'

export const userQuerySchema = z.object({
  email: z.string().email().optional(),
})

export const userUpsertSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email no es válido'),
  avatar: z.string().optional(),
})
