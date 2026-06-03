import { z } from 'zod/v4'

export const reviewQuerySchema = z.object({
  gameId: z.string().min(1, 'gameId es requerido'),
})

export const createReviewSchema = z.object({
  userId: z.string().min(1, 'userId es requerido'),
  gameId: z.string().min(1, 'gameId es requerido'),
  rating: z.number().int().min(1, 'La calificación mínima es 1').max(5, 'La calificación máxima es 5'),
  comment: z.string().min(1, 'El comentario es requerido'),
})
