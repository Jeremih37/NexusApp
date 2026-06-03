import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if database already has data
    const gameCount = await db.game.count()
    if (gameCount > 0) {
      return NextResponse.json({ message: 'Database already seeded', gameCount })
    }

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

    // Create games
    const gamesData = [
      {
        title: 'Cyberpunk 2077', slug: 'cyberpunk-2077',
        description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co1r0h.jpg',
        trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk',
        downloadUrl: 'https://www.gog.com/en/game/cyberpunk_2077',
        developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10',
        rating: 4.2, ratingCount: 156, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true,
      },
      {
        title: 'Elden Ring', slug: 'elden-ring',
        description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co4jni.jpg',
        trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
        downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/',
        developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25',
        rating: 4.8, ratingCount: 230, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true,
      },
      {
        title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok',
        description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5s5v.jpg',
        trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0',
        downloadUrl: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/',
        developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09',
        rating: 4.7, ratingCount: 189, categoryId: action.id, platforms: 'PlayStation, PC', featured: true,
      },
      {
        title: 'The Legend of Zelda: Tears of the Kingdom', slug: 'zelda-totk',
        description: 'La secuela de Breath of the Wild lleva a Link a explorar islas flotantes, cavernas subterráneas y un Hyrule transformado.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl1.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6cl1.jpg',
        trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo',
        downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/',
        developer: 'Nintendo EPD', publisher: 'Nintendo', releaseDate: '2023-05-12',
        rating: 4.9, ratingCount: 275, categoryId: adventure.id, platforms: 'Nintendo Switch', featured: true,
      },
      {
        title: 'Hades II', slug: 'hades-2',
        description: 'Hades II es la secuela del rogue-like aclamado por la crítica. Juega como Melinoë en su búsqueda para derrotar a Chronos.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670x.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co670x.jpg',
        trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY',
        downloadUrl: 'https://store.steampowered.com/app/1145350/Hades_II/',
        developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06',
        rating: 4.6, ratingCount: 98, categoryId: action.id, platforms: 'PC', featured: false,
      },
      {
        title: "Baldur's Gate 3", slug: 'baldurs-gate-3',
        description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica.",
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co670h.jpg',
        trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8',
        downloadUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/',
        developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03',
        rating: 4.8, ratingCount: 312, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true,
      },
      {
        title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake',
        description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a rescatar a la hija del presidente.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo6.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6bo6.jpg',
        trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE',
        downloadUrl: 'https://store.steampowered.com/app/2050650/Resident_Evil_4/',
        developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24',
        rating: 4.5, ratingCount: 178, categoryId: horror.id, platforms: 'PC, PlayStation, Xbox', featured: false,
      },
      {
        title: 'Forza Horizon 5', slug: 'forza-horizon-5',
        description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3v.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5w3v.jpg',
        trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw',
        downloadUrl: 'https://www.xbox.com/en-US/games/store/forza-horizon-5/9n7knz5s4spx',
        developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09',
        rating: 4.4, ratingCount: 145, categoryId: racing.id, platforms: 'PC, Xbox', featured: false,
      },
      {
        title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong',
        description: 'La esperada secuela de Hollow Knight. Juega como Hornet en una nueva aventura a través de un reino completamente nuevo.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2tba.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co2tba.jpg',
        trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg',
        downloadUrl: 'https://store.steampowered.com/app/1030000/Hollow_Knight_Silksong/',
        developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01',
        rating: 4.7, ratingCount: 67, categoryId: indie.id, platforms: 'PC, Nintendo Switch', featured: true,
      },
      {
        title: 'Civilization VII', slug: 'civilization-vii',
        description: 'Lidera tu civilización a través de las eras en la nueva entrega de la saga de estrategia por turnos más aclamada.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yxj.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6yxj.jpg',
        trailerUrl: 'https://www.youtube.com/embed/GbSfHqDh3TM',
        downloadUrl: 'https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/',
        developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2025-02-11',
        rating: 4.1, ratingCount: 52, categoryId: strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false,
      },
      {
        title: 'FIFA 25', slug: 'fifa-25',
        description: 'La experiencia futbolística más realista vuelve con EA Sports FC 25. Con HyperMotionV y FC IQ.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6seq.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6seq.jpg',
        trailerUrl: 'https://www.youtube.com/embed/awLGv0MkzjQ',
        downloadUrl: 'https://www.ea.com/games/ea-sports-fc/fc-25',
        developer: 'EA Canada', publisher: 'EA Sports', releaseDate: '2024-09-27',
        rating: 3.8, ratingCount: 94, categoryId: sports.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false,
      },
      {
        title: 'Starfield', slug: 'starfield',
        description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial.',
        imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6gsx.jpg',
        coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6gsx.jpg',
        trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI',
        downloadUrl: 'https://store.steampowered.com/app/1716740/Starfield/',
        developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06',
        rating: 3.9, ratingCount: 167, categoryId: adventure.id, platforms: 'PC, Xbox', featured: false,
      },
    ]

    const allGames = []
    for (const game of gamesData) {
      const created = await db.game.create({ data: game })
      allGames.push(created)
    }

    // Create reviews
    const reviewData = [
      { userId: user1.id, gameIdx: 0, rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable.' },
      { userId: user2.id, gameIdx: 1, rating: 5, comment: 'Una obra maestra de FromSoftware. El mundo abierto perfecto para su fórmula.' },
      { userId: user3.id, gameIdx: 2, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Combate mejorado y gráficos impresionantes.' },
      { userId: user4.id, gameIdx: 3, rating: 5, comment: 'Nintendo lo volvió a hacer. Las nuevas mecánicas de construcción son geniales.' },
      { userId: user1.id, gameIdx: 5, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad y la narrativa es brillante.' },
      { userId: user2.id, gameIdx: 6, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia.' },
      { userId: user3.id, gameIdx: 4, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. Combate más profundo que nunca.' },
      { userId: user4.id, gameIdx: 8, rating: 5, comment: 'La espera valió la pena. Hornet es increíble y el mundo es más hermoso.' },
      { userId: user1.id, gameIdx: 7, rating: 4, comment: 'El mejor juego de carreras en mundo abierto. México es espectacular.' },
      { userId: user2.id, gameIdx: 11, rating: 3, comment: 'Ambicioso pero con altibajos. Exploración inmersiva pero misiones repetitivas.' },
      { userId: user3.id, gameIdx: 9, rating: 4, comment: 'Firaxis evoluciona la saga con ideas frescas. Las eras añaden dinamismo.' },
      { userId: user4.id, gameIdx: 10, rating: 4, comment: 'Mejoras técnicas notables. HyperMotionV es impresionante.' },
    ]

    for (const r of reviewData) {
      const game = allGames[r.gameIdx]
      if (game) {
        await db.review.create({
          data: { userId: r.userId, gameId: game.id, rating: r.rating, comment: r.comment },
        })
      }
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

    return NextResponse.json({ message: 'Database seeded successfully', games: allGames.length, categories: 8, users: 4 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Error seeding database', details: String(error) }, { status: 500 })
  }
}
