import { db } from '@/lib/db'

export const categoryService = {
  async findAll() {
    return db.category.findMany({
      include: { _count: { select: { games: true } } },
      orderBy: { name: 'asc' },
    })
  },
}
