import { gameService } from '@/services/game.service'
import { handleApiError, ApiError } from '@/lib/api-error'
import { FALLBACK_GAMES } from '@/lib/fallback-data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    try {
      const game = await gameService.findById(id)
      if (game) {
        return NextResponse.json(game)
      }
    } catch (dbError) {
      console.warn('Database unavailable, using fallback data:', dbError instanceof Error ? dbError.message : 'Unknown error')
    }

    // Fallback: Find game in static data
    const game = FALLBACK_GAMES.find(g => g.id === id)
    if (game) {
      return NextResponse.json(game)
    }

    throw new ApiError(404, 'Juego no encontrado')
  } catch (error) {
    return handleApiError(error)
  }
}
