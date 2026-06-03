import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const action = await prisma.category.upsert({
    where: { slug: 'accion' },
    update: {},
    create: { name: 'Acción', slug: 'accion', icon: '⚔️' },
  })

  const rpg = await prisma.category.upsert({
    where: { slug: 'rpg' },
    update: {},
    create: { name: 'RPG', slug: 'rpg', icon: '🗡️' },
  })

  const adventure = await prisma.category.upsert({
    where: { slug: 'aventura' },
    update: {},
    create: { name: 'Aventura', slug: 'aventura', icon: '🗺️' },
  })

  const strategy = await prisma.category.upsert({
    where: { slug: 'estrategia' },
    update: {},
    create: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' },
  })

  const sports = await prisma.category.upsert({
    where: { slug: 'deportes' },
    update: {},
    create: { name: 'Deportes', slug: 'deportes', icon: '⚽' },
  })

  const horror = await prisma.category.upsert({
    where: { slug: 'terror' },
    update: {},
    create: { name: 'Terror', slug: 'terror', icon: '👻' },
  })

  const indie = await prisma.category.upsert({
    where: { slug: 'indie' },
    update: {},
    create: { name: 'Indie', slug: 'indie', icon: '🎮' },
  })

  const racing = await prisma.category.upsert({
    where: { slug: 'carreras' },
    update: {},
    create: { name: 'Carreras', slug: 'carreras', icon: '🏎️' },
  })

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'carlos@nexusapp.com' },
    update: {},
    create: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@nexusapp.com' },
    update: {},
    create: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'admin@nexusapp.com' },
    update: {},
    create: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' },
  })

  const user4 = await prisma.user.upsert({
    where: { email: 'lucia@nexusapp.com' },
    update: {},
    create: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF', role: 'user' },
  })

  // Create games
  const games = [
    {
      title: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único que concede la inmortalidad. Personaliza tu ciberwar, tu estilo y tu estilo de juego mientras exploras una vasta ciudad donde tus decisiones dan forma a la historia.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co1r0h.jpg',
      trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk',
      downloadUrl: 'https://www.gog.com/en/game/cyberpunk_2077',
      developer: 'CD Projekt Red',
      publisher: 'CD Projekt',
      releaseDate: '2020-12-10',
      rating: 4.2,
      ratingCount: 156,
      categoryId: rpg.id,
      platforms: 'PC, PlayStation, Xbox',
      featured: true,
    },
    {
      title: 'Elden Ring',
      slug: 'elden-ring',
      description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros, secretos y jefes épicos. Forja tu camino con una gran variedad de armas, magias y habilidades mientras desentrañas el misterio del Anillo Elden.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co4jni.jpg',
      trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
      downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/',
      developer: 'FromSoftware',
      publisher: 'Bandai Namco',
      releaseDate: '2022-02-25',
      rating: 4.8,
      ratingCount: 230,
      categoryId: rpg.id,
      platforms: 'PC, PlayStation, Xbox',
      featured: true,
    },
    {
      title: 'God of War Ragnarök',
      slug: 'god-of-war-ragnarok',
      description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico. Viaja por los Nueve Reinos, combate criaturas mitológicas y descubre la verdad sobre el destino de Atreus en una aventura épica llena de emoción y combate brutal.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5s5v.jpg',
      trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0',
      downloadUrl: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/',
      developer: 'Santa Monica Studio',
      publisher: 'Sony Interactive',
      releaseDate: '2022-11-09',
      rating: 4.7,
      ratingCount: 189,
      categoryId: action.id,
      platforms: 'PlayStation, PC',
      featured: true,
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      slug: 'zelda-totk',
      description: 'La secuela de Breath of the Wild lleva a Link a explorar islas flotantes, cavernas subterráneas y un Hyrule transformado. Con nuevas habilidades como Ultramano y Fusionar, los jugadores pueden crear soluciones únicas a cada desafío en este mundo abierto revolucionario.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl1.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6cl1.jpg',
      trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo',
      downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/',
      developer: 'Nintendo EPD',
      publisher: 'Nintendo',
      releaseDate: '2023-05-12',
      rating: 4.9,
      ratingCount: 275,
      categoryId: adventure.id,
      platforms: 'Nintendo Switch',
      featured: true,
    },
    {
      title: 'Hades II',
      slug: 'hades-2',
      description: 'Hades II es la secuela del rogue-like aclamado por la crítica. Juega como Melinoë, la hermana de Zagreus, en su búsqueda para derrotar a Chronos, el Titán del tiempo. Con un sistema de combate refinado, nuevos dioses y poderes, y una narrativa profunda basada en la mitología griega.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670x.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co670x.jpg',
      trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY',
      downloadUrl: 'https://store.steampowered.com/app/1145350/Hades_II/',
      developer: 'Supergiant Games',
      publisher: 'Supergiant Games',
      releaseDate: '2024-05-06',
      rating: 4.6,
      ratingCount: 98,
      categoryId: action.id,
      platforms: 'PC',
      featured: false,
    },
    {
      title: 'Baldur\'s Gate 3',
      slug: 'baldurs-gate-3',
      description: 'Baldur\'s Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados. Con un sistema de decisiones profundas, combates tácticos por turnos y una narrativa ramificada, cada partida es única.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co670h.jpg',
      trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8',
      downloadUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/',
      developer: 'Larian Studios',
      publisher: 'Larian Studios',
      releaseDate: '2023-08-03',
      rating: 4.8,
      ratingCount: 312,
      categoryId: rpg.id,
      platforms: 'PC, PlayStation, Xbox',
      featured: true,
    },
    {
      title: 'Resident Evil 4 Remake',
      slug: 'resident-evil-4-remake',
      description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente. Con gráficos modernos, combate reinventado y una atmósfera renovada, esta versión redefine el horror de supervivencia.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo6.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6bo6.jpg',
      trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE',
      downloadUrl: 'https://store.steampowered.com/app/2050650/Resident_Evil_4/',
      developer: 'Capcom',
      publisher: 'Capcom',
      releaseDate: '2023-03-24',
      rating: 4.5,
      ratingCount: 178,
      categoryId: horror.id,
      platforms: 'PC, PlayStation, Xbox',
      featured: false,
    },
    {
      title: 'Forza Horizon 5',
      slug: 'forza-horizon-5',
      description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha. Con cientos de coches, eventos dinámicos y estaciones cambiantes, Forza Horizon 5 ofrece una experiencia de conducción incomparable.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3v.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5w3v.jpg',
      trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw',
      downloadUrl: 'https://www.xbox.com/en-US/games/store/forza-horizon-5/9n7knz5s4spx',
      developer: 'Playground Games',
      publisher: 'Xbox Game Studios',
      releaseDate: '2021-11-09',
      rating: 4.4,
      ratingCount: 145,
      categoryId: racing.id,
      platforms: 'PC, Xbox',
      featured: false,
    },
    {
      title: 'Hollow Knight: Silksong',
      slug: 'hollow-knight-silksong',
      description: 'La esperada secuela de Hollow Knight. Juega como Hornet, la protectora de Hallownest, en una nueva aventura a través de un reino completamente nuevo. Con nuevos movimientos, enemigos y un mundo vasto por descubrir, Silksong promete superar a su predecesor.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2tba.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co2tba.jpg',
      trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg',
      downloadUrl: 'https://store.steampowered.com/app/1030000/Hollow_Knight_Silksong/',
      developer: 'Team Cherry',
      publisher: 'Team Cherry',
      releaseDate: '2025-02-01',
      rating: 4.7,
      ratingCount: 67,
      categoryId: indie.id,
      platforms: 'PC, Nintendo Switch',
      featured: true,
    },
    {
      title: 'Civilization VII',
      slug: 'civilization-vii',
      description: 'Lidera tu civilización a través de las eras en la nueva entrega de la saga de estrategia por turnos más aclamada. Con nuevas mecánicas de edad, líderes carismáticos y un sistema diplomático renovado, construye un imperio que resista la prueba del tiempo.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yxj.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6yxj.jpg',
      trailerUrl: 'https://www.youtube.com/embed/GbSfHqDh3TM',
      downloadUrl: 'https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/',
      developer: 'Firaxis Games',
      publisher: '2K Games',
      releaseDate: '2025-02-11',
      rating: 4.1,
      ratingCount: 52,
      categoryId: strategy.id,
      platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
      featured: false,
    },
    {
      title: 'FIFA 25',
      slug: 'fifa-25',
      description: 'La experiencia futbolística más realista vuelve con EA Sports FC 25. Con HyperMotionV, PlayStyles mejorados y el nuevo modo FC IQ, vive el fútbol como nunca antes. Compite en ligas de todo el mundo con miles de jugadores licenciados.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6seq.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6seq.jpg',
      trailerUrl: 'https://www.youtube.com/embed/awLGv0MkzjQ',
      downloadUrl: 'https://www.ea.com/games/ea-sports-fc/fc-25',
      developer: 'EA Canada',
      publisher: 'EA Sports',
      releaseDate: '2024-09-27',
      rating: 3.8,
      ratingCount: 94,
      categoryId: sports.id,
      platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
      featured: false,
    },
    {
      title: 'Starfield',
      slug: 'starfield',
      description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial. Con más de 1000 planetas por descubrir, construcción de naves, facciones y un sistema de combate profundo, Starfield redefine la exploración espacial.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6gsx.jpg',
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6gsx.jpg',
      trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI',
      downloadUrl: 'https://store.steampowered.com/app/1716740/Starfield/',
      developer: 'Bethesda Game Studios',
      publisher: 'Bethesda Softworks',
      releaseDate: '2023-09-06',
      rating: 3.9,
      ratingCount: 167,
      categoryId: adventure.id,
      platforms: 'PC, Xbox',
      featured: false,
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    })
  }

  // Create reviews
  const allGames = await prisma.game.findMany()

  const reviewData = [
    { user: user1, gameIdx: 0, rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable. Night City es una obra de arte visual.' },
    { user: user2, gameIdx: 1, rating: 5, comment: 'Una obra maestra de FromSoftware. El mundo abierto perfecto para su fórmula. Cada jefe es un desafío épico que te hace querer mejorar constantemente.' },
    { user: user3, gameIdx: 2, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Combate mejorado, historia conmovedora y gráficos impresionantes. El juego que PlayStation necesitaba.' },
    { user: user4, gameIdx: 3, rating: 5, comment: 'Nintendo lo volvió a hacer. Las nuevas mecánicas de construcción son geniales y el mundo es infinitamente creativo. Horas y horas de diversión garantizadas.' },
    { user: user1, gameIdx: 5, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante. Larian ha creado algo especial.' },
    { user: user2, gameIdx: 6, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. El combate es más fluido y los gráficos son impresionantes.' },
    { user: user3, gameIdx: 4, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. Melinoë es un personaje increíble y el combate es más profundo y satisfactorio que nunca.' },
    { user: user4, gameIdx: 8, rating: 5, comment: 'La espera valió la pena. Hornet se siente diferente a jugar que el Caballero y el mundo es aún más hermoso y misterioso.' },
    { user: user1, gameIdx: 7, rating: 4, comment: 'El mejor juego de carreras en mundo abierto. México es un escenario espectacular y la variedad de coches es impresionante.' },
    { user: user2, gameIdx: 11, rating: 3, comment: 'Ambicioso pero con altibajos. La exploración espacial es inmersiva pero las misiones repetitivas y los planetas vacíos bajan la experiencia.' },
    { user: user3, gameIdx: 9, rating: 4, comment: 'Firaxis evoluciona la saga con ideas frescas. Las eras añaden dinamismo pero algunos añoran la profundidad de entregas anteriores.' },
    { user: user4, gameIdx: 10, rating: 4, comment: 'Mejoras técnicas notables pero se siente iterativo. HyperMotionV es impresionante pero el modo carrera necesita más innovación.' },
  ]

  for (const r of reviewData) {
    const game = allGames[r.gameIdx]
    if (game) {
      await prisma.review.upsert({
        where: { userId_gameId: { userId: r.user.id, gameId: game.id } },
        update: {},
        create: {
          userId: r.user.id,
          gameId: game.id,
          rating: r.rating,
          comment: r.comment,
        },
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
        await prisma.favorite.upsert({
          where: { userId_gameId: { userId: fav.userId, gameId: game.id } },
          update: {},
          create: { userId: fav.userId, gameId: game.id },
        })
      }
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
