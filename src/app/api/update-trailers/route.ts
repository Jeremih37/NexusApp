import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { rawgService } from '@/services/rawg-service'

// POST /api/update-trailers - Update game trailers from RAWG API
// Each game is fetched by slug, ensuring the trailer matches the game
// Body: { slugs?: string[], overwrite?: boolean, apiKey?: string }
// If overwrite=true, updates ALL games (even those with existing trailers)
// If overwrite=false (default), only updates games without a trailerUrl
export async function POST(request: NextRequest) {
  let rawgApiKey = process.env.RAWG_API_KEY
  let requestBody: Record<string, unknown> = {}

  try {
    requestBody = await request.json()
  } catch {
    requestBody = {}
  }

  // Fallback: accept apiKey in request body
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

  const overwrite = requestBody.overwrite === true
  const customSlugs = requestBody.slugs as string[] | undefined

  try {
    // Get all games from database
    const games = await db.game.findMany({
      select: { id: true, slug: true, title: true, trailerUrl: true }
    })

    // Filter to specific slugs if provided
    let gamesToUpdate = customSlugs
      ? games.filter(g => customSlugs.includes(g.slug))
      : games

    // If not overwriting, only update games without trailers
    if (!overwrite) {
      gamesToUpdate = gamesToUpdate.filter(g => !g.trailerUrl)
    }

    const updated: string[] = []
    const errors: string[] = []
    const skipped: string[] = []

    console.log(`🎬 Updating trailers for ${gamesToUpdate.length} games from RAWG API...`)

    // Known slug mapping: DB slug → RAWG slug (for games where they differ)
    const SLUG_MAP: Record<string, string> = {
      'the-last-of-us-part-ii': 'the-last-of-us-part-2',
      'the-legend-of-zelda-tears-of-the-kingdom': 'the-legend-of-zelda-breath-of-the-wild-sequel',
      'god-of-war-2018': 'god-of-war-2',
      'spider-man-remastered': 'marvels-spider-man-remastered',
      'dead-space-remake': 'dead-space',
      'pokemon-scarlet-violet': 'pokemon-scarletviolet',
      'animal-crossing-new-horizons': 'animal-crossing-2019',
      'resident-evil-4-remake': 'resident-evil-4-2023',
      'monster-hunter-world': 'monster-hunter-world-2',
      'sekiro-shadows-die-twice': 'shadows-die-twice',
      'horizon-forbidden-west': 'horizon-zero-dawn-2',
      'the-legend-of-zelda-breath-of-the-wild': 'the-legend-of-zelda-breath-of-the-wild',
      'super-mario-odyssey': 'super-mario-odyssey',
      'rimworld': 'rimworld',
      'dark-souls-2-scholar': 'dark-souls-ii-scholar-of-the-first-sin',
      'hitman-world-of-assassination': 'hitman-3',
      'green-hell': 'green-hell',
      'grounded': 'grounded-2',
      'doom-eternal-shooter': 'doom-eternal',
      'tomb-raider-2013': 'tomb-raider-2013',
    }

    for (let i = 0; i < gamesToUpdate.length; i++) {
      const game = gamesToUpdate[i]

      try {
        // Use mapped slug if available, otherwise use the DB slug
        const rawgSlug = SLUG_MAP[game.slug] || game.slug

        // Fetch game from RAWG by slug to get the RAWG game ID
        const rawgGame = await rawgService.getGameBySlug(rawgSlug)

        if (!rawgGame) {
          errors.push(`${game.slug}: game not found on RAWG`)
          continue
        }

        // Get trailer URL from RAWG (with YouTube search fallback)
        const trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id, rawgGame.name)

        if (!trailerUrl) {
          errors.push(`${game.slug}: no trailer available from RAWG or YouTube`)
          continue
        }

        // Update the game with the trailer URL
        await db.game.update({
          where: { id: game.id },
          data: { trailerUrl },
        })

        updated.push(`${game.title} (${game.slug}) → ${trailerUrl}`)
        console.log(`  ✅ Updated trailer: ${game.title} → ${trailerUrl}`)

        // Rate limiting: RAWG free tier allows ~4 req/sec
        // We make 2 API calls per game (getGameBySlug + getBestTrailerUrl)
        if ((i + 1) % 2 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1200))
        }

      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        errors.push(`${game.slug}: ${msg}`)
        console.warn(`  ❌ Failed to update trailer for ${game.slug}: ${msg}`)
      }
    }

    return NextResponse.json({
      message: `Trailers updated from RAWG API - each trailer matches its game`,
      totalGames: games.length,
      gamesNeedingTrailers: gamesToUpdate.length,
      updated: updated.length,
      errors: errors.length,
      details: {
        updated,
        errors: errors.slice(0, 30),
      }
    })

  } catch (error) {
    console.error('Update trailers error:', error)
    return NextResponse.json(
      { error: 'Failed to update trailers', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// GET /api/update-trailers - Check trailer status
export async function GET() {
  const rawgConfigured = !!process.env.RAWG_API_KEY
  const gameCount = await db.game.count()
  const gamesWithTrailers = await db.game.count({
    where: { trailerUrl: { not: null } }
  })
  const gamesWithoutTrailers = gameCount - gamesWithTrailers

  // List games without trailers
  const missingTrailers = await db.game.findMany({
    where: { trailerUrl: null },
    select: { slug: true, title: true }
  })

  return NextResponse.json({
    rawgConfigured,
    totalGames: gameCount,
    gamesWithTrailers,
    gamesWithoutTrailers,
    missingTrailers: missingTrailers.map(g => g.slug),
    message: rawgConfigured
      ? `RAWG API configured. ${gamesWithoutTrailers} games need trailers. Use POST to update.`
      : 'RAWG_API_KEY not configured.'
  })
}
