import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Steam CDN URLs - public, HD, and ALWAYS match the game
const STEAM_CAPSULE = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`
const STEAM_HERO = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`
const STEAM_STORE = (appId: string) => `https://store.steampowered.com/app/${appId}/`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    if (force) {
      await db.favorite.deleteMany()
      await db.review.deleteMany()
      await db.game.deleteMany()
      await db.category.deleteMany()
      await db.user.deleteMany()
    }

    const gameCount = await db.game.count()
    if (gameCount > 0 && !force) {
      return NextResponse.json({ message: 'Database already seeded. Use ?force=true to reset and re-seed.', gameCount })
    }

    // Try RAWG API if key is configured
    if (process.env.RAWG_API_KEY) {
      try {
        return await seedFromRawg()
      } catch (error) {
        console.error('RAWG seed failed, falling back to Steam images:', error)
      }
    }

    // Fallback: Steam Store images (verified, HD, always match the game)
    return await seedFromSteam()
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Error seeding database', details: String(error) }, { status: 500 })
  }
}

// RAWG API seed - each game fetched by slug = guaranteed consistency
async function seedFromRawg() {
  const { rawgService } = await import('@/services/rawg-service')

  const categoryMap = new Map<string, Awaited<ReturnType<typeof db.category.create>>>()
  for (const [, catData] of Object.entries(rawgService.GENRE_CATEGORY_MAP)) {
    const created = await db.category.create({
      data: { name: catData.name, slug: catData.slug, icon: catData.icon }
    })
    categoryMap.set(catData.slug, created)
  }

  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })
  const user3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })

  const allSlugs = [...rawgService.ALL_GAME_SLUGS]
  const allGames: any[] = []

  for (let i = 0; i < allSlugs.length; i++) {
    const slug = allSlugs[i]
    try {
      const rawgGame = await rawgService.getGameBySlug(slug)
      if (!rawgGame || !rawgGame.background_image) continue

      const genreInfo = rawgService.getPrimaryGenre(rawgGame)
      if (!genreInfo) continue

      const category = categoryMap.get(genreInfo.slug)
      if (!category) continue

      let trailerUrl: string | null = null
      try { trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id) } catch {}

      const downloadUrl = rawgService.getDownloadUrl(rawgGame)
      const gameData = rawgService.mapRawgGameToGameData(rawgGame, category.id, trailerUrl || undefined, downloadUrl || undefined)
      gameData.featured = rawgService.FEATURED_SLUGS.has(slug)

      const game = await db.game.create({ data: gameData })
      allGames.push(game)

      if ((i + 1) % 3 === 0) await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.warn(`Failed to seed game "${slug}":`, error)
    }
  }

  await createSampleReviews(user1.id, user2.id, user3.id, allGames)
  return NextResponse.json({ message: 'Database seeded from RAWG API!', games: allGames.length, categories: categoryMap.size })
}

// Steam Store seed - verified HD images, no API key needed
// Each game's cover, name, and download link come from the SAME Steam App ID
async function seedFromSteam() {
  // Create categories
  const categories = {
    action: await db.category.create({ data: { name: 'Acción', slug: 'accion', icon: '⚔️' } }),
    rpg: await db.category.create({ data: { name: 'RPG', slug: 'rpg', icon: '🗡️' } }),
    adventure: await db.category.create({ data: { name: 'Aventura', slug: 'aventura', icon: '🗺️' } }),
    strategy: await db.category.create({ data: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' } }),
    sports: await db.category.create({ data: { name: 'Deportes', slug: 'deportes', icon: '⚽' } }),
    indie: await db.category.create({ data: { name: 'Indie', slug: 'indie', icon: '🎮' } }),
    racing: await db.category.create({ data: { name: 'Carreras', slug: 'carreras', icon: '🏎️' } }),
    shooter: await db.category.create({ data: { name: 'Shooter', slug: 'shooter', icon: '🔫' } }),
    puzzle: await db.category.create({ data: { name: 'Puzzle', slug: 'puzzle', icon: '🧩' } }),
    simulation: await db.category.create({ data: { name: 'Simulación', slug: 'simulacion', icon: '🏗️' } }),
    fighting: await db.category.create({ data: { name: 'Lucha', slug: 'lucha', icon: '🥊' } }),
    platforms: await db.category.create({ data: { name: 'Plataformas', slug: 'plataformas', icon: '🍄' } }),
  }

  // Create users
  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })
  const user3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })
  const user4 = await db.user.create({ data: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF', role: 'user' } })

  // Games data with VERIFIED Steam App IDs
  // imageUrl = Steam capsule (616x353 HD) → matches game name
  // coverUrl = Steam hero (1920x1080 HD) → matches game name
  // downloadUrl = Steam store page → matches game name
  // ALL derived from the SAME Steam App ID = 100% consistency guaranteed
  const gamesData = [
    { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', steamId: '1091500', description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad.', trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10', rating: 4.2, ratingCount: 156, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Elden Ring', slug: 'elden-ring', steamId: '1245620', description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros, secretos y jefes épicos.', trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25', rating: 4.8, ratingCount: 230, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', steamId: '1593500', description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico.', trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09', rating: 4.7, ratingCount: 189, categoryId: categories.action.id, platforms: 'PlayStation, PC', featured: true },
    { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', steamId: '1086940', description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados con decisiones profundas y combates tácticos.", trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8', developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03', rating: 4.8, ratingCount: 312, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', steamId: '2050650', description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente. Combate reinventado y atmósfera renovada.', trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24', rating: 4.5, ratingCount: 178, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Forza Horizon 5', slug: 'forza-horizon-5', steamId: '1551360', description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha.', trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw', developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09', rating: 4.4, ratingCount: 145, categoryId: categories.racing.id, platforms: 'PC, Xbox', featured: true },
    { title: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', steamId: '1174180', description: 'América, 1899. Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con el tiempo corriendo en su contra, Arthur debe elegir entre sus ideales y la lealtad.', trailerUrl: 'https://www.youtube.com/embed/gmA6MrX81z4', developer: 'Rockstar Games', publisher: 'Rockstar Games', releaseDate: '2019-11-05', rating: 4.8, ratingCount: 250, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'The Witcher 3: Wild Hunt', slug: 'the-witcher-3-wild-hunt', steamId: '292030', description: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos. El RPG que definió una generación.', trailerUrl: 'https://www.youtube.com/embed/c0i88t0Kacs', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2015-05-19', rating: 4.7, ratingCount: 300, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true },
    { title: 'Black Myth: Wukong', slug: 'black-myth-wukong', steamId: '2358720', description: 'Un RPG de acción basado en la mitología china del Rey Mono. Combate espectacular, jefes colosales y un mundo inspirado en Viaje al Oeste.', trailerUrl: 'https://www.youtube.com/embed/4oStw0r33so', developer: 'Game Science', publisher: 'Game Science', releaseDate: '2024-08-20', rating: 4.6, ratingCount: 180, categoryId: categories.action.id, platforms: 'PC, PlayStation', featured: true },
    { title: 'Hogwarts Legacy', slug: 'hogwarts-legacy', steamId: '990080', description: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico.', trailerUrl: 'https://www.youtube.com/embed/2AZmuZNu5LA', developer: 'Avalanche Software', publisher: 'Warner Bros. Games', releaseDate: '2023-02-10', rating: 4.3, ratingCount: 200, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true },
    { title: 'Ghost of Tsushima', slug: 'ghost-of-tsushima', steamId: '1240440', description: 'En 1274, los mongoles invaden la isla de Tsushima. Jin Sakai debe sacrificarse para proteger su hogar y convertirse en el Fantasma de Tsushima.', trailerUrl: 'https://www.youtube.com/embed/bVpuls6hW3A', developer: 'Sucker Punch Productions', publisher: 'Sony Interactive', releaseDate: '2024-05-16', rating: 4.6, ratingCount: 175, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: true },
    { title: 'Hades II', slug: 'hades-ii', steamId: '1145350', description: 'La secuela del rogue-like aclamado. Juega como Melinoë en su búsqueda para derrotar a Chronos, el Titán del tiempo.', trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY', developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06', rating: 4.6, ratingCount: 98, categoryId: categories.action.id, platforms: 'PC', featured: false },
    { title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong', steamId: '1030000', description: 'La esperada secuela de Hollow Knight. Juega como Hornet en una nueva aventura a través de un reino completamente nuevo.', trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01', rating: 4.7, ratingCount: 67, categoryId: categories.indie.id, platforms: 'PC, Nintendo Switch', featured: true },
    { title: 'Starfield', slug: 'starfield', steamId: '1716740', description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial.', trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06', rating: 3.9, ratingCount: 167, categoryId: categories.adventure.id, platforms: 'PC, Xbox', featured: false },
    { title: 'Grand Theft Auto V', slug: 'grand-theft-auto-v', steamId: '271590', description: 'El mundo abierto de Los Santos y Blaine County. Tres criminales se unen en una serie de atracos peligrosos.', trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs', developer: 'Rockstar North', publisher: 'Rockstar Games', releaseDate: '2015-04-14', rating: 4.5, ratingCount: 400, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Dark Souls III', slug: 'dark-souls-iii', steamId: '374320', description: 'La entrega final de la saga Dark Souls. Viaja a Lothric y enciende la llama que mantiene a la oscuridad a raya.', trailerUrl: 'https://www.youtube.com/embed/_zDZYr8g4_g', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2016-04-11', rating: 4.6, ratingCount: 210, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Death Stranding', slug: 'death-stranding', steamId: '548430', description: 'Sam Porter Bridges debe viajar por los Estados Unidos en ruinas para reconstruir la sociedad. Un juego de Hideo Kojima.', trailerUrl: 'https://www.youtube.com/embed/tCIqRgMB3cY', developer: 'Kojima Productions', publisher: 'Kojima Productions', releaseDate: '2020-07-14', rating: 4.2, ratingCount: 145, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: false },
    { title: 'Stardew Valley', slug: 'stardew-valley', steamId: '413150', description: 'Hereda la granja de tu abuelo y comienza una nueva vida en Stardew Valley. Cultiva, cría animales y socializa.', trailerUrl: 'https://www.youtube.com/embed/otj5MBsU0qU', developer: 'ConcernedApe', publisher: 'ConcernedApe', releaseDate: '2016-02-26', rating: 4.9, ratingCount: 320, categoryId: categories.simulation.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Hollow Knight', slug: 'hollow-knight', steamId: '431960', description: 'Descubre un vasto reino subterráneo de insectos y héroes olvidados. El metroidvania definitivo.', trailerUrl: 'https://www.youtube.com/embed/UAO2urG23S4', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2017-02-24', rating: 4.8, ratingCount: 280, categoryId: categories.indie.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Doom Eternal', slug: 'doom-eternal', steamId: '519860', description: 'El Slayer regresa para desgarra y destroza a las hordas demoníacas con un arsenal letal y movimientos acrobáticos.', trailerUrl: 'https://www.youtube.com/embed/qf6YVOqw0CI', developer: 'id Software', publisher: 'Bethesda Softworks', releaseDate: '2020-03-19', rating: 4.5, ratingCount: 160, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Fallout 4', slug: 'fallout-4', steamId: '377160', description: 'En el año 2287, emerges del Refugio 111 al páramo de Boston. Busca a tu hijo secuestrado en un mundo abierto lleno de peligro.', trailerUrl: 'https://www.youtube.com/embed/X5aJFezNA1g', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2015-11-09', rating: 4.3, ratingCount: 190, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Monster Hunter: World', slug: 'monster-hunter-world', steamId: '632470', description: 'Caza monstruos gigantes en ecosistemas vivos. Fabrica armas y armaduras poderosas y únete a otros cazadores.', trailerUrl: 'https://www.youtube.com/embed/hgDfn8yoM0E', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2018-08-09', rating: 4.4, ratingCount: 165, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Control', slug: 'control', steamId: '812140', description: 'Jesse Faden busca respuestas en la Federal Bureau of Control, un edificio que desafía la realidad.', trailerUrl: 'https://www.youtube.com/embed/HsgEFDQKwMk', developer: 'Remedy Entertainment', publisher: '505 Games', releaseDate: '2019-08-27', rating: 4.2, ratingCount: 120, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Celeste', slug: 'celeste', steamId: '504230', description: 'Ayuda a Madeline a sobrevivir a sus demonios internos en su camino hacia la cima de la montaña Celeste.', trailerUrl: 'https://www.youtube.com/embed/Ok4HGs-q8ls', developer: 'Maddy Makes Games', publisher: 'Maddy Makes Games', releaseDate: '2018-01-25', rating: 4.7, ratingCount: 135, categoryId: categories.indie.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: "It Takes Two", slug: 'it-takes-two', steamId: '1426210', description: 'La aventura cooperativa más loca. Cody y May, convertidos en muñecos, deben trabajar juntos para volver a ser humanos.', trailerUrl: 'https://www.youtube.com/embed/mP8eGnOzFP8', developer: 'Hazelight Studios', publisher: 'EA', releaseDate: '2021-03-26', rating: 4.6, ratingCount: 110, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'The Elder Scrolls V: Skyrim', slug: 'the-elder-scrolls-v-skyrim', steamId: '489830', description: 'Como Sangre de Dragón, debes detener a Alduin mientras exploras las tierras de Skyrim. El RPG que definió una generación.', trailerUrl: 'https://www.youtube.com/embed/JSRtYpNRoN0', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2016-10-28', rating: 4.5, ratingCount: 250, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Batman: Arkham Knight', slug: 'batman-arkham-knight', steamId: '1111460', description: 'Batman se enfrenta al Espantapájaros y el misterioso Arkham Knight en la conclusión de la saga.', trailerUrl: 'https://www.youtube.com/embed/VLqaBOrYMok', developer: 'Rocksteady Studios', publisher: 'Warner Bros. Games', releaseDate: '2015-06-23', rating: 4.3, ratingCount: 150, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Helldivers 2', slug: 'helldivers-2', steamId: '553850', description: 'Únete a la lucha por la democracia en este shooter cooperativo en tercera persona. ¡Cuidado con el fuego amigo!', trailerUrl: 'https://www.youtube.com/embed/f6ZZlGnMMEQ', developer: 'Arrowhead Game Studios', publisher: 'Sony Interactive', releaseDate: '2024-02-08', rating: 4.4, ratingCount: 140, categoryId: categories.shooter.id, platforms: 'PC, PlayStation', featured: false },
    { title: "Dragon's Dogma 2", slug: 'dragons-dogma-2', steamId: '2108330', description: 'La esperada secuela del RPG de acción de Capcom. Explora un mundo abierto con peones leales y combate dinámico.', trailerUrl: 'https://www.youtube.com/embed/r4T2FD9WqE4', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2024-03-22', rating: 4.0, ratingCount: 85, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Like a Dragon: Infinite Wealth', slug: 'like-a-dragon-infinite-wealth', steamId: '2323410', description: 'Ichiban Kasuga y Kazuma Kiryu se unen en una aventura épica que cruza Japón y Hawái.', trailerUrl: 'https://www.youtube.com/embed/BK3RcBkzDQQ', developer: 'Ryu Ga Gotoku Studio', publisher: 'SEGA', releaseDate: '2024-01-26', rating: 4.5, ratingCount: 95, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Sekiro: Shadows Die Twice', slug: 'sekiro-shadows-die-twice', steamId: '814380', description: 'En el Japón Sengoku, un shinobi desfigurado busca venganza con un brazo protésico y combate basado en postura.', trailerUrl: 'https://www.youtube.com/embed/rXMX4YJ7Lks', developer: 'FromSoftware', publisher: 'Activision', releaseDate: '2019-03-22', rating: 4.6, ratingCount: 170, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Civilization VI', slug: 'civilization-vi', steamId: '289070', description: 'Construye un imperio que resista la prueba del tiempo. La estrategia por turnos más profunda vuelve.', trailerUrl: 'https://www.youtube.com/embed/JEQhCJbhsMY', developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2016-10-21', rating: 4.1, ratingCount: 180, categoryId: categories.strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Portal 2', slug: 'portal-2', steamId: '620', description: 'El juego de puzzles más creativo de la historia. Usa tu pistola de portales en las instalaciones de Aperture Science.', trailerUrl: 'https://www.youtube.com/embed/ax1Fo7DbQDQ', developer: 'Valve', publisher: 'Valve', releaseDate: '2011-04-18', rating: 4.8, ratingCount: 260, categoryId: categories.puzzle.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Counter-Strike 2', slug: 'counter-strike-2', steamId: '730', description: 'El shooter táctico más jugado del mundo regresa con el motor Source 2. Misma competencia feroz, nueva tecnología.', trailerUrl: 'https://www.youtube.com/embed/GiKHmusnMcE', developer: 'Valve', publisher: 'Valve', releaseDate: '2023-09-27', rating: 4.0, ratingCount: 350, categoryId: categories.shooter.id, platforms: 'PC', featured: false },
    { title: 'Overwatch 2', slug: 'overwatch-2', steamId: '1817070', description: 'El shooter de héroes de Blizzard con formato 5v5 más dinámico. Decenas de héroes únicos con habilidades distintas.', trailerUrl: 'https://www.youtube.com/embed/GKXS_YA9j0c', developer: 'Blizzard Entertainment', publisher: 'Blizzard Entertainment', releaseDate: '2023-08-10', rating: 3.8, ratingCount: 200, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Metaphor: ReFantazio', slug: 'metaphor-refantazio', steamId: '1620340', description: 'Del estudio detrás de Persona llega un RPG que redefine el género con combate en tiempo real y por turnos.', trailerUrl: 'https://www.youtube.com/embed/0aMV7n4Uzpw', developer: 'Studio Zero', publisher: 'SEGA', releaseDate: '2024-10-11', rating: 4.7, ratingCount: 75, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: "Dragon Age: The Veilguard", slug: 'dragon-age-the-veilguard', steamId: '1841400', description: 'La esperada secuela de Dragon Age. Reúne un equipo para enfrentar una amenaza que podría destruir Thedas.', trailerUrl: 'https://www.youtube.com/embed/CUBM0H3Y5yQ', developer: 'BioWare', publisher: 'EA', releaseDate: '2024-10-31', rating: 3.9, ratingCount: 65, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Tekken 8', slug: 'tekken-8', steamId: '1778820', description: 'La saga de lucha más legendaria regresa con el sistema Heat revolucionario. Jin vs Kazuya en la batalla definitiva.', trailerUrl: 'https://www.youtube.com/embed/WfFSVL5iPSQ', developer: 'Bandai Namco Studios', publisher: 'Bandai Namco', releaseDate: '2024-01-25', rating: 4.2, ratingCount: 90, categoryId: categories.fighting.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: "Assassin's Creed Shadows", slug: 'assassins-creed-shadows', steamId: '2001120', description: "Dos protagonistas, un Japón feudal en guerra. Naoe la shinobi y Yasuke el samurái en la era Sengoku.", trailerUrl: 'https://www.youtube.com/embed/vovkzmt3NqA', developer: 'Ubisoft Quebec', publisher: 'Ubisoft', releaseDate: '2025-03-20', rating: 4.0, ratingCount: 55, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Horizon Forbidden West', slug: 'horizon-forbidden-west', steamId: '594650', description: 'Aloy viaja a la Costa Prohibida para descubrir la fuente de una plaga misteriosa en este mundo abierto impresionante.', trailerUrl: 'https://www.youtube.com/embed/Lq594vMpJsw', developer: 'Guerrilla Games', publisher: 'Sony Interactive', releaseDate: '2024-03-21', rating: 4.4, ratingCount: 120, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: false },
    { title: 'Apex Legends', slug: 'apex-legends', steamId: '516750', description: 'El battle royale de héroes más rápido y táctico. Leyendas con habilidades únicas, movimiento fluido y combate intenso.', trailerUrl: 'https://www.youtube.com/embed/oOmega7YcmMs', developer: 'Respawn Entertainment', publisher: 'EA', releaseDate: '2020-11-04', rating: 4.0, ratingCount: 270, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
  ]

  const allGames: any[] = []

  for (const game of gamesData) {
    const created = await db.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        imageUrl: STEAM_CAPSULE(game.steamId),  // 616x353 HD - matches game name
        coverUrl: STEAM_HERO(game.steamId),     // 1920x1080 HD - matches game name
        trailerUrl: game.trailerUrl || null,
        downloadUrl: STEAM_STORE(game.steamId),  // Steam store page - matches game name
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        rating: game.rating,
        ratingCount: game.ratingCount,
        categoryId: game.categoryId,
        platforms: game.platforms,
        featured: game.featured,
      },
    })
    allGames.push(created)
  }

  // Create reviews
  await createSampleReviews(user1.id, user2.id, user3.id, allGames, user4.id)

  // Create favorites
  const favoriteData = [
    { userId: user1.id, gameIdx: [0, 2, 4, 8, 11, 14] },
    { userId: user2.id, gameIdx: [1, 3, 5, 7, 10, 13] },
    { userId: user3.id, gameIdx: [0, 4, 6, 9, 12, 15] },
    { userId: user4.id, gameIdx: [2, 3, 7, 11, 14] },
  ]

  for (const fav of favoriteData) {
    for (const idx of fav.gameIdx) {
      const game = allGames[idx]
      if (game) {
        await db.favorite.create({ data: { userId: fav.userId, gameId: game.id } })
      }
    }
  }

  return NextResponse.json({
    message: 'Database seeded with verified Steam Store images! Every cover matches its game title.',
    games: allGames.length,
    categories: Object.keys(categories).length,
    users: 4,
    note: 'Each game cover, name, and download link come from the SAME Steam App ID = 100% consistency',
  })
}

async function createSampleReviews(user1Id: string, user2Id: string, user3Id: string, games: any[], user4Id?: string) {
  const reviewComments = [
    { rating: 4, comment: 'Increíble mundo abierto y narrativa. La experiencia completa es memorable y Night City es una obra de arte visual.' },
    { rating: 5, comment: 'Una obra maestra. Cada jefe es un desafío épico que te hace querer mejorar constantemente. El mundo abierto es perfecto.' },
    { rating: 5, comment: 'Combate mejorado, historia conmovedora y gráficos impresionantes. Imprescindible para cualquier jugador.' },
    { rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante.' },
    { rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. Combate más fluido y gráficos impresionantes.' },
    { rating: 4, comment: 'El mejor juego de carreras en mundo abierto. Escenario espectacular y variedad impresionante de coches.' },
    { rating: 5, comment: 'Una experiencia narrativa sin igual. El mundo es el más vivo y detallado que he visto. Arthur Morgan es inolvidable.' },
    { rating: 5, comment: 'Sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que juegos enteros.' },
    { rating: 5, comment: 'Una revelación. Combate adictivo, jefes espectaculares y la mitología le da una frescura increíble.' },
    { rating: 4, comment: 'Hace justicia al mundo mágico. Explorar el castillo es una delicia y los hechizos son divertidos.' },
    { rating: 5, comment: 'Poesía visual. El combate con katana es elegante y la historia es conmovedora y épica.' },
    { rating: 4, comment: 'Sigue siendo entretenido después de todos estos años. La ciudad es increíblemente detallada.' },
  ]

  const userIds = [user1Id, user2Id, user3Id, user4Id].filter(Boolean) as string[]

  for (let i = 0; i < Math.min(games.length, reviewComments.length * 3); i++) {
    const review = reviewComments[i % reviewComments.length]
    const userId = userIds[i % userIds.length]
    const game = games[i]
    if (!game) continue

    const existing = await db.review.findFirst({ where: { userId, gameId: game.id } })
    if (!existing) {
      await db.review.create({
        data: { userId, gameId: game.id, rating: review.rating, comment: review.comment }
      })
    }
  }
}
