import { z } from 'zod/v4'

export const favoriteQuerySchema = z.object({
  userId: z.string().min(1, 'userId es requerido'),
})

export const toggleFavoriteSchema = z.object({
  userId: z.string().min(1, 'userId es requerido'),
  gameId: z.string().min(1, 'gameId es requerido'),
})
