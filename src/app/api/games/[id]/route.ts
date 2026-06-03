import { gameService } from '@/services/game.service'
import { handleApiError, ApiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const game = await gameService.findById(id)

    if (!game) {
      throw new ApiError(404, 'Juego no encontrado')
    }

    return NextResponse.json(game)
  } catch (error) {
    return handleApiError(error)
  }
}
