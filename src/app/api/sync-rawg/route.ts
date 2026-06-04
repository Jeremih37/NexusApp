import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { rawgService } from '@/services/rawg-service'

// POST /api/sync-rawg - Sync games from RAWG API to our database
// Body: { reset?: boolean } - if true, clears existing games first
export async function POST(request: NextRequest) {
  const rawgApiKey = process.env.RAWG_API_KEY

  if (!rawgApiKey) {
    return NextResponse.json(
      { error: 'RAWG_API_KEY not configured. Add it to your environment variables.' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const reset = body.reset === true

    // If reset, delete existing games, reviews, favorites
    if (reset) {
      await db.favorite.deleteMany()
      await db.review.deleteMany()
      await db.game.deleteMany()
      await db.category.deleteMany()
    }

    // Ensure categories exist
    const existingCategories = await db.category.findMany()
    const categoryMap = new Map(existingCategories.map(c => [c.slug, c]))

    // Create missing categories from our genre mapping
    for (const [, catData] of Object.entries(rawgService.GENRE_CATEGORY_MAP)) {
      if (!categoryMap.has(catData.slug)) {
        const created = await db.category.create({
          data: { name: catData.name, slug: catData.slug, icon: catData.icon }
        })
        categoryMap.set(catData.slug, created)
      }
    }

    // Fetch games from RAWG
    const gameSlugs = [...rawgService.FEATURED_GAME_SLUGS, ...rawgService.ADDITIONAL_GAME_SLUGS]
    const syncedGames: string[] = []
    const errors: string[] = []

    // Process in batches to avoid rate limiting
    for (let i = 0; i < gameSlugs.length; i++) {
      const slug = gameSlugs[i]

      try {
        // Check if game already exists
        const existing = await db.game.findFirst({ where: { slug } })
        if (existing && !reset) {
          syncedGames.push(`${slug} (already exists)`)
          continue
        }

        // Fetch game data from RAWG
        const rawgGame = await rawgService.getGameBySlug(slug)
        if (!rawgGame) {
          errors.push(`${slug}: not found on RAWG`)
          continue
        }

        if (!rawgGame.background_image) {
          errors.push(`${slug}: no image available, skipping`)
          continue
        }

        // Get the primary genre/category
        const genreInfo = rawgService.getPrimaryGenre(rawgGame)
        if (!genreInfo) {
          errors.push(`${slug}: no matching genre`)
          continue
        }

        const category = categoryMap.get(genreInfo.slug)
        if (!category) {
          errors.push(`${slug}: category not found in DB`)
          continue
        }

        // Fetch trailer URL
        let trailerUrl: string | null = null
        try {
          trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id)
        } catch (e) {
          console.warn(`Could not fetch trailer for ${slug}`)
        }

        // Get download URL
        const downloadUrl = rawgService.getDownloadUrl(rawgGame)

        // Map to our game data
        const gameData = rawgService.mapRawgGameToGameData(
          rawgGame,
          category.id,
          trailerUrl || undefined,
          downloadUrl || undefined,
        )

        // Mark featured games
        gameData.featured = rawgService.FEATURED_GAME_SLUGS.includes(slug)

        // Create or update the game
        if (existing && reset) {
          await db.game.update({ where: { id: existing.id }, data: gameData })
        } else if (!existing) {
          await db.game.create({ data: gameData })
        }

        syncedGames.push(slug)

        // Small delay to avoid hitting rate limits (RAWG allows ~4 req/sec on free tier)
        if ((i + 1) % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1100))
        }

      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        errors.push(`${slug}: ${msg}`)
      }
    }

    // Ensure we have a demo user
    let demoUser = await db.user.findFirst({ where: { email: 'carlos@nexusapp.com' } })
    if (!demoUser) {
      demoUser = await db.user.create({
        data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' }
      })
    }

    // Create some sample reviews for the synced games
    const games = await db.game.findMany({ take: 10 })
    const reviewComments = [
      { rating: 5, comment: 'Una obra maestra absoluta. Cada detalle está cuidado al máximo y la experiencia es inolvidable.' },
      { rating: 4, comment: 'Excelente juego con una historia cautivadora. Algunos detalles técnicos menores pero la experiencia general es fantástica.' },
      { rating: 5, comment: 'Simplemente increíble. Gráficos impresionantes, gameplay adictivo y una narrativa que te atrapa desde el primer momento.' },
      { rating: 4, comment: 'Muy buen juego con mecánicas sólidas. La duración es adecuada y los gráficos son de primera calidad.' },
      { rating: 5, comment: 'Uno de los mejores juegos que he jugado. La atención al detalle es impresionante y cada sesión es una experiencia única.' },
      { rating: 4, comment: 'Gran juego que cumple con creces las expectativas. El mundo abierto es vasto y lleno de sorpresas.' },
      { rating: 3, comment: 'Buen juego pero con margen de mejora. La historia es interesante pero algunos aspectos técnicos necesitan pulido.' },
      { rating: 5, comment: 'Perfecto en casi todo. Visualmente deslumbrante y con un sistema de combate que nunca aburre.' },
      { rating: 4, comment: 'Sólido y entretenido. No reinventa el género pero hace todo muy bien y con mucha personalidad.' },
      { rating: 5, comment: 'Imprescindible. Si te gusta el género, este juego es obligatorio. La calidad se nota en cada rincón.' },
    ]

    for (let i = 0; i < Math.min(games.length, reviewComments.length); i++) {
      const existingReview = await db.review.findFirst({
        where: { userId: demoUser.id, gameId: games[i].id }
      })
      if (!existingReview) {
        await db.review.create({
          data: {
            userId: demoUser.id,
            gameId: games[i].id,
            rating: reviewComments[i].rating,
            comment: reviewComments[i].comment,
          }
        })
      }
    }

    const totalGames = await db.game.count()

    return NextResponse.json({
      message: 'RAWG sync completed',
      synced: syncedGames.length,
      errors: errors.length,
      totalGames,
      details: {
        synced: syncedGames,
        errors: errors.slice(0, 10),
      }
    })

  } catch (error) {
    console.error('RAWG sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// GET /api/sync-rawg - Check sync status
export async function GET() {
  const rawgApiKey = process.env.RAWG_API_KEY
  const gameCount = await db.game.count()
  const categoryCount = await db.category.count()

  return NextResponse.json({
    rawgConfigured: !!rawgApiKey,
    totalGames: gameCount,
    totalCategories: categoryCount,
    message: rawgApiKey
      ? 'RAWG API is configured. Use POST to sync games.'
      : 'RAWG_API_KEY not configured. Add it to your environment variables.'
  })
}
