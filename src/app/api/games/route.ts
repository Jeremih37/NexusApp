import { gameService } from '@/services/game.service'
import { handleApiError } from '@/lib/api-error'
import { gameQuerySchema } from '@/schemas/game.schema'
import { FALLBACK_GAMES } from '@/lib/fallback-data'
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

    try {
      const games = await gameService.findAll({
        category: validated.category,
        search: validated.search,
        featured: validated.featured === 'true',
        sort: validated.sort,
      })
      
      // If database returned games, use them
      if (games && games.length > 0) {
        return NextResponse.json(games)
      }
    } catch (dbError) {
      console.warn('Database unavailable, using fallback data:', dbError instanceof Error ? dbError.message : 'Unknown error')
    }

    // Fallback: Use static JSON data when database is unavailable
    let games = [...FALLBACK_GAMES]

    // Apply filters
    if (validated.category && validated.category !== 'all') {
      games = games.filter(g => g.category?.slug === validated.category)
    }

    if (validated.search) {
      const search = validated.search.toLowerCase()
      games = games.filter(g => 
        g.title.toLowerCase().includes(search) || 
        g.developer.toLowerCase().includes(search)
      )
    }

    if (validated.featured === 'true') {
      games = games.filter(g => g.featured)
    }

    // Apply sorting
    const sort = validated.sort || 'rating'
    if (sort === 'rating') games.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (sort === 'name') games.sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json(games)
  } catch (error) {
    return handleApiError(error)
  }
}
