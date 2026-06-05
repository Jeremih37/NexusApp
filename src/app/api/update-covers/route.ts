import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { rawgService } from '@/services/rawg-service'

// POST /api/update-covers - Update all game covers from RAWG API
// Each game is fetched by its slug, so the cover ALWAYS matches the game
// Body: { slugs?: string[] } (optional - if not provided, updates all games)
export async function POST(request: NextRequest) {
  let rawgApiKey = process.env.RAWG_API_KEY
  let requestBody: Record<string, unknown> = {}

  try {
    requestBody = await request.json()
  } catch {
    requestBody = {}
  }

  // Fallback: accept apiKey in request body (for one-time setup)
  if (!rawgApiKey) {
    rawgApiKey = requestBody.apiKey as string | undefined
  }

  if (!rawgApiKey) {
    return NextResponse.json(
      { error: 'RAWG_API_KEY not configured. Add it to your environment variables or provide apiKey in request body.' },
      { status: 400 }
    )
  }

  // Set the API key for the rawgService to use
  process.env.RAWG_API_KEY = rawgApiKey

  try {
    const customSlugs = requestBody.slugs as string[] | undefined

    // Get all games from database
    const games = await db.game.findMany({
      select: { id: true, slug: true, title: true }
    })

    // Filter to specific slugs if provided
    const gamesToUpdate = customSlugs
      ? games.filter(g => customSlugs.includes(g.slug))
      : games

    const updated: string[] = []
    const errors: string[] = []

    console.log(`🖼️ Updating covers for ${gamesToUpdate.length} games from RAWG API...`)

    for (let i = 0; i < gamesToUpdate.length; i++) {
      const game = gamesToUpdate[i]

      try {
        // Fetch game from RAWG by slug - guarantees correct cover for this game
        const rawgGame = await rawgService.getGameBySlug(game.slug)

        if (!rawgGame || !rawgGame.background_image) {
          errors.push(`${game.slug}: no image available on RAWG`)
          continue
        }

        // Use HD image URLs from RAWG CDN
        // imageUrl = card thumbnail (600x400 crop - works on RAWG CDN)
        // coverUrl = HD background for detail page (full-size original, since crop > 600/400 doesn't work)
        const imageUrl = rawgService.getHdImageUrl(rawgGame.background_image, 600, 400) || rawgGame.background_image
        const coverUrl = rawgGame.background_image_additional || rawgGame.background_image

        // Also get trailer URL if game doesn't have one
        let trailerUrl: string | null = null
        try {
          trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id)
        } catch {
          // Trailer fetch is optional
        }

        // Update the game with correct covers
        const updateData: Record<string, string> = { imageUrl, coverUrl }
        if (trailerUrl) {
          const existingGame = await db.game.findUnique({ where: { id: game.id } })
          if (existingGame && !existingGame.trailerUrl) {
            updateData.trailerUrl = trailerUrl
          }
        }

        await db.game.update({
          where: { id: game.id },
          data: updateData,
        })

        updated.push(`${game.title} (${game.slug})`)
        console.log(`  ✅ Updated cover: ${game.title}`)

        // Rate limiting: RAWG free tier allows ~4 req/sec
        if ((i + 1) % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1100))
        }

      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        errors.push(`${game.slug}: ${msg}`)
        console.warn(`  ❌ Failed to update cover for ${game.slug}: ${msg}`)
      }
    }

    return NextResponse.json({
      message: `Covers updated from RAWG API - each cover matches its game`,
      totalGames: games.length,
      updated: updated.length,
      errors: errors.length,
      details: {
        updated,
        errors: errors.slice(0, 30),
      }
    })

  } catch (error) {
    console.error('Update covers error:', error)
    return NextResponse.json(
      { error: 'Failed to update covers', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// GET /api/update-covers - Check status
export async function GET() {
  const rawgConfigured = !!process.env.RAWG_API_KEY
  const gameCount = await db.game.count()
  const gamesWithCovers = await db.game.count({
    where: { imageUrl: { contains: 'rawg.io' } }
  })
  const gamesWithSteamCovers = await db.game.count({
    where: { imageUrl: { contains: 'steamstatic' } }
  })

  return NextResponse.json({
    rawgConfigured,
    totalGames: gameCount,
    gamesWithRawgCovers: gamesWithCovers,
    gamesWithSteamCovers: gamesWithSteamCovers,
    message: rawgConfigured
      ? `RAWG API configured. Use POST to update all ${gameCount} game covers with HD images from RAWG. Each game's cover will match its title.`
      : 'RAWG_API_KEY not configured. Add it to update covers with HD images.'
  })
}
