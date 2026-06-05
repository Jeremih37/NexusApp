import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/games/[id]/cover - Update a game's cover images
// Body: { imageUrl: string, coverUrl: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { imageUrl, coverUrl } = body as { imageUrl?: string; coverUrl?: string }

    if (!imageUrl && !coverUrl) {
      return NextResponse.json(
        { error: 'Provide imageUrl and/or coverUrl to update' },
        { status: 400 }
      )
    }

    const updateData: Record<string, string> = {}
    if (imageUrl) updateData.imageUrl = imageUrl
    if (coverUrl) updateData.coverUrl = coverUrl

    const game = await db.game.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ message: 'Cover updated', game: { id: game.id, title: game.title, imageUrl: game.imageUrl } })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update cover', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
