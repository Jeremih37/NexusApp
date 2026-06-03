import { reviewService } from '@/services/review.service'
import { handleApiError } from '@/lib/api-error'
import { reviewQuerySchema, createReviewSchema } from '@/schemas/review.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validated = reviewQuerySchema.parse({
      gameId: searchParams.get('gameId') || undefined,
    })

    const reviews = await reviewService.findByGameId(validated.gameId)
    return NextResponse.json(reviews)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createReviewSchema.parse(body)

    const review = await reviewService.upsert(validated)
    return NextResponse.json(review)
  } catch (error) {
    return handleApiError(error)
  }
}
