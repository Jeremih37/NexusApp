import { db } from '@/lib/db'

export const gameService = {
  async findAll(params: { category?: string; search?: string; featured?: boolean; sort?: string }) {
    const where: any = {}

    if (params.category && params.category !== 'all') {
      const cat = await db.category.findFirst({ where: { slug: params.category } })
      if (cat) where.categoryId = cat.id
    }

    if (params.search) {
      where.title = { contains: params.search }
    }

    if (params.featured) {
      where.featured = true
    }

    const sort = params.sort || 'rating'
    const orderBy =
      sort === 'rating'
        ? { rating: 'desc' as const }
        : sort === 'newest'
          ? { createdAt: 'desc' as const }
          : sort === 'name'
            ? { title: 'asc' as const }
            : { rating: 'desc' as const }

    return db.game.findMany({
      where,
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        downloadLinks: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy,
    })
  },

  async findById(id: string) {
    return db.game.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
        downloadLinks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  },
}
