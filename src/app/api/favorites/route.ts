import { db, ensureDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await ensureDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: {
        game: {
          include: { category: true }
        }
      }
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB()
    const body = await request.json()
    const { userId, gameId } = body

    if (!userId || !gameId) {
      return NextResponse.json({ error: 'userId y gameId son requeridos' }, { status: 400 })
    }

    const existing = await db.favorite.findUnique({
      where: { userId_gameId: { userId, gameId } }
    })

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ removed: true })
    } else {
      const favorite = await db.favorite.create({ data: { userId, gameId } })
      return NextResponse.json({ added: true, favorite })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json({ error: 'Error al actualizar favorito' }, { status: 500 })
  }
}
