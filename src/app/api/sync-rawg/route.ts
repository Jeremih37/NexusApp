import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { rawgService } from '@/services/rawg-service'

// POST /api/sync-rawg - Sync games from RAWG API to our database
// Each game is fetched by slug, so ALL data (name, cover, link) comes from ONE API call
// This guarantees data consistency: the cover image always matches the game title
// Body: { reset?: boolean, slugs?: string[] }
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
    const customSlugs = body.slugs as string[] | undefined

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

    // Determine which games to sync
    const gameSlugs = customSlugs || rawgService.ALL_GAME_SLUGS
    const syncedGames: string[] = []
    const errors: string[] = []

    // Process in batches to avoid rate limiting
    for (let i = 0; i < gameSlugs.length; i++) {
      const slug = gameSlugs[i]

      try {
        // Check if game already exists (skip if not resetting)
        const existing = await db.game.findFirst({ where: { slug } })
        if (existing && !reset) {
          syncedGames.push(`${slug} (already exists)`)
          continue
        }

        // Fetch game data from RAWG - ONE API call for ONE game
        // This ensures name, cover image, and store links all belong to the SAME game
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
        } catch {
          console.warn(`Could not fetch trailer for ${slug}`)
        }

        // Get download URL from the SAME game's store data
        const downloadUrl = rawgService.getDownloadUrl(rawgGame)

        // Map to our game data (uses HD images from RAWG CDN)
        const gameData = rawgService.mapRawgGameToGameData(
          rawgGame,
          category.id,
          trailerUrl || undefined,
          downloadUrl || undefined,
        )

        // Mark featured games
        gameData.featured = rawgService.FEATURED_SLUGS.has(slug)

        // Create or update the game
        if (existing && reset) {
          await db.game.update({ where: { id: existing.id }, data: gameData })
        } else if (!existing) {
          await db.game.create({ data: gameData })
        }

        syncedGames.push(`${slug} ✅`)
        console.log(`Synced: ${rawgGame.name} (cover matches name matches link)`)

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

    // Create sample reviews for the synced games
    const games = await db.game.findMany({ take: 16 })
    const reviewComments = [
      { rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable.' },
      { rating: 5, comment: 'Una obra maestra. Cada jefe es un desafío épico que te hace querer mejorar constantemente.' },
      { rating: 5, comment: 'Combate mejorado, historia conmovedora y gráficos impresionantes. Imprescindible.' },
      { rating: 5, comment: 'Las nuevas mecánicas son geniales y el mundo es infinitamente creativo. Horas de diversión garantizadas.' },
      { rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad y la narrativa es brillante.' },
      { rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia.' },
      { rating: 5, comment: 'El combate es más profundo y satisfactorio que nunca. Supergiant no falla.' },
      { rating: 4, comment: 'El mejor juego de carreras en mundo abierto. Escenario espectacular y variedad impresionante.' },
      { rating: 3, comment: 'Ambicioso pero con altibajos. La exploración espacial es inmersiva pero tiene misiones repetitivas.' },
      { rating: 5, comment: 'Una experiencia narrativa sin igual. El mundo abierto más vivo y detallado que he visto.' },
      { rating: 5, comment: 'Sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que juegos enteros.' },
      { rating: 5, comment: 'Una revelación. El combate es adictivo, los jefes son espectaculares y la mitología es fascinante.' },
      { rating: 4, comment: 'Hace justicia al mundo mágico. Explorar el castillo es una delicia y los hechizos son divertidos.' },
      { rating: 5, comment: 'Poesía visual. El combate con katana es elegante y la historia es conmovedora y épica.' },
      { rating: 4, comment: 'Sigue siendo entretenido después de todos estos años. La ciudad es increíblemente detallada.' },
      { rating: 5, comment: 'Simplemente perfecto en casi todo. Visualmente deslumbrante y con un sistema de combate que nunca aburre.' },
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
      message: 'RAWG sync completed - all covers match their game titles',
      synced: syncedGames.length,
      errors: errors.length,
      totalGames,
      details: {
        synced: syncedGames,
        errors: errors.slice(0, 20),
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
    availableSlugs: rawgService.ALL_GAME_SLUGS.length,
    message: rawgApiKey
      ? `RAWG API is configured. Use POST to sync up to ${rawgService.ALL_GAME_SLUGS.length} games. Each game's cover, name, and download link will all match.`
      : 'RAWG_API_KEY not configured. Add it to your environment variables.'
  })
}
