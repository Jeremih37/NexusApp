import { db, ensureDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await ensureDB()
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!gameId) {
      return NextResponse.json({ error: 'gameId es requerido' }, { status: 400 })
    }

    const reviews = await db.review.findMany({
      where: { gameId },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB()
    const body = await request.json()
    const { userId, gameId, rating, comment } = body

    if (!userId || !gameId || !rating || !comment) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 })
    }

    const review = await db.review.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: { rating, comment },
      create: { userId, gameId, rating, comment },
    })

    const reviews = await db.review.findMany({ where: { gameId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await db.game.update({
      where: { id: gameId },
      data: { rating: Math.round(avgRating * 10) / 10, ratingCount: reviews.length }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Error al crear reseña' }, { status: 500 })
  }
}
