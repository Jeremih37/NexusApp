import { favoriteService } from '@/services/favorite.service'
import { handleApiError } from '@/lib/api-error'
import { favoriteQuerySchema, toggleFavoriteSchema } from '@/schemas/favorite.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validated = favoriteQuerySchema.parse({
      userId: searchParams.get('userId') || undefined,
    })

    const favorites = await favoriteService.findByUserId(validated.userId)
    return NextResponse.json(favorites)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = toggleFavoriteSchema.parse(body)

    const result = await favoriteService.toggle(validated.userId, validated.gameId)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
