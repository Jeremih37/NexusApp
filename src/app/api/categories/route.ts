import { categoryService } from '@/services/category.service'
import { handleApiError } from '@/lib/api-error'
import { FALLBACK_CATEGORIES } from '@/lib/fallback-data'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    try {
      const categories = await categoryService.findAll()
      if (categories && categories.length > 0) {
        return NextResponse.json(categories)
      }
    } catch (dbError) {
      console.warn('Database unavailable, using fallback data:', dbError instanceof Error ? dbError.message : 'Unknown error')
    }

    // Fallback: Use static data
    return NextResponse.json(FALLBACK_CATEGORIES)
  } catch (error) {
    return handleApiError(error)
  }
}
