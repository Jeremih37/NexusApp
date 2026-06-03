import { db, ensureDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await ensureDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'rating'

    const where: any = {}

    if (category && category !== 'all') {
      const cat = await db.category.findFirst({ where: { slug: category } })
      if (cat) where.categoryId = cat.id
    }

    if (search) {
      where.title = { contains: search }
    }

    if (featured === 'true') {
      where.featured = true
    }

    const games = await db.game.findMany({
      where,
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } }
          }
        }
      },
      orderBy: sort === 'rating' ? { rating: 'desc' } : sort === 'newest' ? { createdAt: 'desc' } : sort === 'name' ? { title: 'asc' } : { rating: 'desc' },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Error al obtener juegos' }, { status: 500 })
  }
}
