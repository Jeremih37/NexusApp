import { db, ensureDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await ensureDB()
    const categories = await db.category.findMany({
      include: {
        _count: { select: { games: true } }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}
