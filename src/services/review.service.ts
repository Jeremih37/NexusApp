import { db } from '@/lib/db'

export const reviewService = {
  async findByGameId(gameId: string) {
    return db.review.findMany({
      where: { gameId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
  },

  async upsert(data: { userId: string; gameId: string; rating: number; comment: string }) {
    const review = await db.review.upsert({
      where: { userId_gameId: { userId: data.userId, gameId: data.gameId } },
      update: { rating: data.rating, comment: data.comment },
      create: data,
    })

    // Recalculate game rating
    const reviews = await db.review.findMany({ where: { gameId: data.gameId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await db.game.update({
      where: { id: data.gameId },
      data: { rating: Math.round(avgRating * 10) / 10, ratingCount: reviews.length },
    })

    return review
  },
}
