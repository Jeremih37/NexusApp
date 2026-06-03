import { gameService } from '@/services/game.service'
import { handleApiError } from '@/lib/api-error'
import { gameQuerySchema } from '@/schemas/game.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validated = gameQuerySchema.parse({
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') || undefined,
      sort: searchParams.get('sort') || undefined,
    })

    const games = await gameService.findAll({
      category: validated.category,
      search: validated.search,
      featured: validated.featured === 'true',
      sort: validated.sort,
    })

    return NextResponse.json(games)
  } catch (error) {
    return handleApiError(error)
  }
}
