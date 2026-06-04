import { db } from '@/lib/db'

export const favoriteService = {
  async findByUserId(userId: string) {
    return db.favorite.findMany({
      where: { userId },
      include: { game: { include: { category: true } } },
    })
  },

  async toggle(userId: string, gameId: string) {
    const existing = await db.favorite.findUnique({
      where: { userId_gameId: { userId, gameId } },
    })

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } })
      return { removed: true }
    } else {
      const favorite = await db.favorite.create({ data: { userId, gameId } })
      return { added: true, favorite }
    }
  },
}
