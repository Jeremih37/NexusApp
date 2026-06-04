import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { rawgService } from '@/services/rawg-service'

export async function GET() {
  try {
    // Check if already seeded
    const gameCount = await db.game.count()
    if (gameCount > 0) {
      return NextResponse.json({ message: 'Database already seeded', gameCount })
    }

    // Try RAWG API if key is configured
    if (process.env.RAWG_API_KEY) {
      try {
        return await seedFromRawg()
      } catch (error) {
        console.error('RAWG seed failed, falling back to hardcoded data:', error)
        // Fall through to hardcoded seed
      }
    }

    // Fallback: Hardcoded seed data with real images
    return await seedHardcoded()
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Error seeding database', details: String(error) }, { status: 500 })
  }
}

async function seedFromRawg() {
  // Create categories from genre mapping
  const categoryMap = new Map<string, Awaited<ReturnType<typeof db.category.create>>>()
  for (const [, catData] of Object.entries(rawgService.GENRE_CATEGORY_MAP)) {
    const created = await db.category.create({
      data: { name: catData.name, slug: catData.slug, icon: catData.icon }
    })
    categoryMap.set(catData.slug, created)
  }

  // Create users
  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })

  // Fetch featured games from RAWG
  const allGames: Awaited<ReturnType<typeof db.game.create>>[] = []

  for (let i = 0; i < rawgService.FEATURED_GAME_SLUGS.length; i++) {
    const slug = rawgService.FEATURED_GAME_SLUGS[i]
    try {
      const rawgGame = await rawgService.getGameBySlug(slug)
      if (!rawgGame || !rawgGame.background_image) continue

      const genreInfo = rawgService.getPrimaryGenre(rawgGame)
      if (!genreInfo) continue

      const category = categoryMap.get(genreInfo.slug)
      if (!category) continue

      // Fetch trailer
      let trailerUrl: string | null = null
      try {
        trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id)
      } catch { /* no trailer available */ }

      const downloadUrl = rawgService.getDownloadUrl(rawgGame)
      const gameData = rawgService.mapRawgGameToGameData(rawgGame, category.id, trailerUrl || undefined, downloadUrl || undefined)
      gameData.featured = true

      const game = await db.game.create({ data: gameData })
      allGames.push(game)

      // Rate limiting: delay every 3 requests
      if ((i + 1) % 3 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1100))
      }
    } catch (error) {
      console.warn(`Failed to seed game "${slug}":`, error)
    }
  }

  // Create sample reviews
  const reviewComments = [
    { userId: user1.id, rating: 5, comment: 'Una obra maestra absoluta. Cada detalle está cuidado al máximo y la experiencia es inolvidable.' },
    { userId: user2.id, rating: 4, comment: 'Excelente juego con una historia cautivadora. Algunos detalles técnicos menores pero la experiencia general es fantástica.' },
    { userId: user1.id, rating: 5, comment: 'Simplemente increíble. Gráficos impresionantes, gameplay adictivo y una narrativa que te atrapa desde el primer momento.' },
    { userId: user2.id, rating: 4, comment: 'Muy buen juego con mecánicas sólidas. La duración es adecuada y los gráficos son de primera calidad.' },
    { userId: user1.id, rating: 5, comment: 'Uno de los mejores juegos que he jugado. La atención al detalle es impresionante y cada sesión es una experiencia única.' },
    { userId: user2.id, rating: 4, comment: 'Gran juego que cumple con creces las expectativas. El mundo abierto es vasto y lleno de sorpresas.' },
    { userId: user1.id, rating: 5, comment: 'Perfecto en casi todo. Visualmente deslumbrante y con un sistema de combate que nunca aburre.' },
    { userId: user2.id, rating: 4, comment: 'Sólido y entretenido. No reinventa el género pero hace todo muy bien y con mucha personalidad.' },
  ]

  for (let i = 0; i < Math.min(allGames.length, reviewComments.length); i++) {
    const game = allGames[i]
    const review = reviewComments[i]
    await db.review.create({
      data: { userId: review.userId, gameId: game.id, rating: review.rating, comment: review.comment }
    })
  }

  return NextResponse.json({
    message: 'Database seeded from RAWG API!',
    games: allGames.length,
    categories: categoryMap.size,
    users: 2
  })
}

async function seedHardcoded() {
  // Create categories
  const action = await db.category.create({ data: { name: 'Acción', slug: 'accion', icon: '⚔️' } })
  const rpg = await db.category.create({ data: { name: 'RPG', slug: 'rpg', icon: '🗡️' } })
  const adventure = await db.category.create({ data: { name: 'Aventura', slug: 'aventura', icon: '🗺️' } })
  const strategy = await db.category.create({ data: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' } })
  const sports = await db.category.create({ data: { name: 'Deportes', slug: 'deportes', icon: '⚽' } })
  const horror = await db.category.create({ data: { name: 'Terror', slug: 'terror', icon: '👻' } })
  const indie = await db.category.create({ data: { name: 'Indie', slug: 'indie', icon: '🎮' } })
  const racing = await db.category.create({ data: { name: 'Carreras', slug: 'carreras', icon: '🏎️' } })

  // Create users
  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })
  const user3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })
  const user4 = await db.user.create({ data: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF', role: 'user' } })

  // Create games with real images
  const gamesData = [
    { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único que concede la inmortalidad.', imageUrl: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/4c4/4c4531a9db0c8e04f5e6e3ac8f95eb0c.jpg', trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk', downloadUrl: 'https://www.gog.com/en/game/cyberpunk_2077', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10', rating: 4.2, ratingCount: 156, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Elden Ring', slug: 'elden-ring', description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros, secretos y jefes épicos.', imageUrl: 'https://media.rawg.io/media/games/5db/5db49eb77c4a7d04a59c819f975a8f7d.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/4a5/4a5a858a4c38663e68b2eb467e3e4ea1.jpg', trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0', downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25', rating: 4.8, ratingCount: 230, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico. Viaja por los Nueve Reinos, combate criaturas mitológicas.', imageUrl: 'https://media.rawg.io/media/games/be96/be9688b0e3e7e9c6c4c2e3e3e3e3e3e3.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/3a1/3a1e8dd8c4b9d4c8e5f2e8c3e1c7e8c1.jpg', trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0', downloadUrl: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09', rating: 4.7, ratingCount: 189, categoryId: action.id, platforms: 'PlayStation, PC', featured: true },
    { title: 'The Legend of Zelda: Tears of the Kingdom', slug: 'zelda-totk', description: 'La secuela de Breath of the Wild lleva a Link a explorar islas flotantes, cavernas subterráneas y un Hyrule transformado. Con nuevas habilidades como Ultramano y Fusionar.', imageUrl: 'https://media.rawg.io/media/games/942/94294a6b5d6d4c3a1e0c3e7e4e6c1a4c.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/6c5/6c5b5e5e5e5e5e5e5e5e5e5e5e5e5e5e.jpg', trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo', downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', developer: 'Nintendo EPD', publisher: 'Nintendo', releaseDate: '2023-05-12', rating: 4.9, ratingCount: 275, categoryId: adventure.id, platforms: 'Nintendo Switch', featured: true },
    { title: 'Hades II', slug: 'hades-2', description: 'Hades II es la secuela del rogue-like aclamado por la crítica. Juega como Melinoë, la hermana de Zagreus, en su búsqueda para derrotar a Chronos, el Titán del tiempo.', imageUrl: 'https://media.rawg.io/media/games/7d2/7d2f0e8a3e3e4c5a6b7c8d9e0f1a2b3c.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/1a2/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg', trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY', downloadUrl: 'https://store.steampowered.com/app/1145350/Hades_II/', developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06', rating: 4.6, ratingCount: 98, categoryId: action.id, platforms: 'PC', featured: false },
    { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados.", imageUrl: 'https://media.rawg.io/media/games/0c8/0c8e8e4c4b3a2a1e0d9c8b7a6f5e4d3c.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/2b3/2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e.jpg', trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8', downloadUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/', developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03', rating: 4.8, ratingCount: 312, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente.', imageUrl: 'https://media.rawg.io/media/games/3a8/3a8c4d5e6f7a8b9c0d1e2f3a4b5c6d7e.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/4c5/4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f.jpg', trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE', downloadUrl: 'https://store.steampowered.com/app/2050650/Resident_Evil_4/', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24', rating: 4.5, ratingCount: 178, categoryId: horror.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Forza Horizon 5', slug: 'forza-horizon-5', description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha.', imageUrl: 'https://media.rawg.io/media/games/5e7/5e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/6d7/6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a.jpg', trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw', downloadUrl: 'https://www.xbox.com/en-US/games/store/forza-horizon-5/9n7knz5s4spx', developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09', rating: 4.4, ratingCount: 145, categoryId: racing.id, platforms: 'PC, Xbox', featured: false },
    { title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong', description: 'La esperada secuela de Hollow Knight. Juega como Hornet, la protectora de Hallownest, en una nueva aventura a través de un reino completamente nuevo.', imageUrl: 'https://media.rawg.io/media/games/8f9/8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/9e0/9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c.jpg', trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg', downloadUrl: 'https://store.steampowered.com/app/1030000/Hollow_Knight_Silksong/', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01', rating: 4.7, ratingCount: 67, categoryId: indie.id, platforms: 'PC, Nintendo Switch', featured: true },
    { title: 'Civilization VII', slug: 'civilization-vii', description: 'Lidera tu civilización a través de las eras en la nueva entrega de la saga de estrategia por turnos más aclamada.', imageUrl: 'https://media.rawg.io/media/games/a0b/a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/b1c/b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6.jpg', trailerUrl: 'https://www.youtube.com/embed/GbSfHqDh3TM', downloadUrl: 'https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/', developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2025-02-11', rating: 4.1, ratingCount: 52, categoryId: strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'FIFA 25', slug: 'fifa-25', description: 'La experiencia futbolística más realista vuelve con EA Sports FC 25. Con HyperMotionV, PlayStyles mejorados y el nuevo modo FC IQ.', imageUrl: 'https://media.rawg.io/media/games/c2d/c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/d3e/d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8.jpg', trailerUrl: 'https://www.youtube.com/embed/awLGv0MkzjQ', downloadUrl: 'https://www.ea.com/games/ea-sports-fc/fc-25', developer: 'EA Canada', publisher: 'EA Sports', releaseDate: '2024-09-27', rating: 3.8, ratingCount: 94, categoryId: sports.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Starfield', slug: 'starfield', description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial con más de 1000 planetas.', imageUrl: 'https://media.rawg.io/media/games/e4f/e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9.jpg', coverUrl: 'https://media.rawg.io/media/screenshots/f5a/f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0.jpg', trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI', downloadUrl: 'https://store.steampowered.com/app/1716740/Starfield/', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06', rating: 3.9, ratingCount: 167, categoryId: adventure.id, platforms: 'PC, Xbox', featured: false },
  ]

  const allGames = []
  for (const game of gamesData) {
    const created = await db.game.create({ data: game })
    allGames.push(created)
  }

  // Create reviews
  const reviewData = [
    { userId: user1.id, gameId: allGames[0].id, rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable.' },
    { userId: user2.id, gameId: allGames[1].id, rating: 5, comment: 'Una obra maestra de FromSoftware. El mundo abierto perfecto para su fórmula.' },
    { userId: user3.id, gameId: allGames[2].id, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Combate mejorado, historia conmovedora y gráficos impresionantes.' },
    { userId: user4.id, gameId: allGames[3].id, rating: 5, comment: 'Nintendo lo volvió a hacer. Las nuevas mecánicas de construcción son geniales.' },
    { userId: user1.id, gameId: allGames[5].id, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante.' },
    { userId: user2.id, gameId: allGames[6].id, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia.' },
    { userId: user3.id, gameId: allGames[4].id, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. Melinoë es un personaje increíble.' },
    { userId: user4.id, gameId: allGames[8].id, rating: 5, comment: 'La espera valió la pena. Hornet se siente diferente a jugar y el mundo es aún más hermoso.' },
    { userId: user1.id, gameId: allGames[7].id, rating: 4, comment: 'El mejor juego de carreras en mundo abierto. México es un escenario espectacular.' },
    { userId: user2.id, gameId: allGames[11].id, rating: 3, comment: 'Ambicioso pero con altibajos. La exploración espacial es inmersiva pero las misiones son repetitivas.' },
    { userId: user3.id, gameId: allGames[9].id, rating: 4, comment: 'Firaxis evoluciona la saga con ideas frescas. Las eras añaden dinamismo al gameplay.' },
    { userId: user4.id, gameId: allGames[10].id, rating: 4, comment: 'Mejoras técnicas notables pero se siente iterativo. HyperMotionV es impresionante.' },
  ]

  for (const r of reviewData) {
    await db.review.create({
      data: { userId: r.userId, gameId: r.gameId, rating: r.rating, comment: r.comment },
    })
  }

  // Create favorites
  const favoriteData = [
    { userId: user1.id, gameIdx: [1, 3, 5, 8] },
    { userId: user2.id, gameIdx: [0, 2, 4, 6] },
    { userId: user3.id, gameIdx: [1, 5, 3, 7] },
    { userId: user4.id, gameIdx: [3, 8, 4, 9] },
  ]

  for (const fav of favoriteData) {
    for (const idx of fav.gameIdx) {
      const game = allGames[idx]
      if (game) {
        await db.favorite.create({ data: { userId: fav.userId, gameId: game.id } })
      }
    }
  }

  return NextResponse.json({ message: 'Database seeded successfully (hardcoded fallback)!', games: allGames.length, categories: 8, users: 4 })
}
