import { db, ensureDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDB()
    const { id } = await params
    const game = await db.game.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!game) {
      return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 })
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json({ error: 'Error al obtener el juego' }, { status: 500 })
  }
}
