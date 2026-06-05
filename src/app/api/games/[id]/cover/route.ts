import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/games/[id]/cover - Update a game's cover images and/or trailer
// Body: { imageUrl?: string, coverUrl?: string, trailerUrl?: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { imageUrl, coverUrl, trailerUrl } = body as { imageUrl?: string; coverUrl?: string; trailerUrl?: string }

    if (!imageUrl && !coverUrl && trailerUrl === undefined) {
      return NextResponse.json(
        { error: 'Provide imageUrl, coverUrl, and/or trailerUrl to update' },
        { status: 400 }
      )
    }

    const updateData: Record<string, string | null> = {}
    if (imageUrl) updateData.imageUrl = imageUrl
    if (coverUrl) updateData.coverUrl = coverUrl
    if (trailerUrl !== undefined) updateData.trailerUrl = trailerUrl || null

    const game = await db.game.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ message: 'Game updated', game: { id: game.id, title: game.title, imageUrl: game.imageUrl, trailerUrl: game.trailerUrl } })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update game', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
