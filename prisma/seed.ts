import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const RAWG_BASE_URL = 'https://api.rawg.io/api'

// ============================================================
// Game slugs to fetch from RAWG API
// Each slug fetches its OWN data (name, cover, stores) from ONE API call
// This guarantees data consistency: cover matches name matches link
// ============================================================
const GAME_SLUGS = [
  'cyberpunk-2077',
  'elden-ring',
  'god-of-war-ragnarok',
  'the-legend-of-zelda-tears-of-the-kingdom',
  'baldurs-gate-3',
  'hollow-knight-silksong',
  'resident-evil-4-remake',
  'forza-horizon-5',
  'starfield',
  'hades-ii',
  'grand-theft-auto-v',
  'red-dead-redemption-2',
  'the-witcher-3-wild-hunt',
  'minecraft',
  'fortnite',
  'valorant',
  'overwatch-2',
  'apex-legends',
  'spider-man-2',
  'hogwarts-legacy',
  'diablo-iv',
  'final-fantasy-xvi',
  'street-fighter-6',
  'assassins-creed-shadows',
  'metaphor-refantazio',
  'black-myth-wukong',
  'persona-5-royal',
  'ghost-of-tsushima',
  'death-stranding',
  'dark-souls-iii',
  'mass-effect-legendary-edition',
  'halo-infinite',
  'horizon-forbidden-west',
  'dishonored-2',
  'control',
  'it-takes-two',
  'celeste',
  'stardew-valley',
  'hollow-knight',
  'the-last-of-us-part-ii',
  'sea-of-thieves',
  'fallout-4',
  'doom-eternal',
  'monster-hunter-world',
  'civilization-vi',
  'total-war-warhammer-iii',
  'xcom-2',
  'dragons-dogma-2',
  'helldivers-2',
  'palworld',
  'like-a-dragon-infinite-wealth',
  'tekken-8',
  'dragon-age-the-veilguard',
  'batman-arkham-knight',
  'the-elder-scrolls-v-skyrim',
  'portal-2',
  'half-life-2',
  'left-4-dead-2',
  'counter-strike-2',
  'genshin-impact',
  'bioshock-infinite',
  'tomb-raider-2013',
  'shadow-of-the-colossus',
  'metal-gear-solid-v-the-phantom-pain',
  'super-mario-odyssey',
  'super-smash-bros-ultimate',
  'animal-crossing-new-horizons',
  'mario-kart-8-deluxe',
  'splatoon-3',
  'metroid-dread',
  'pokemon-scarlet-violet',
  'xenoblade-chronicles-3',
]

const FEATURED_SLUGS = new Set([
  'cyberpunk-2077',
  'elden-ring',
  'god-of-war-ragnarok',
  'the-legend-of-zelda-tears-of-the-kingdom',
  'baldurs-gate-3',
  'hollow-knight-silksong',
  'resident-evil-4-remake',
  'forza-horizon-5',
  'starfield',
  'hades-ii',
  'grand-theft-auto-v',
  'red-dead-redemption-2',
  'the-witcher-3-wild-hunt',
  'black-myth-wukong',
  'hogwarts-legacy',
  'ghost-of-tsushima',
])

// Genre mapping: RAWG genre slug → our category
const GENRE_MAP: Record<string, { name: string; slug: string; icon: string }> = {
  'action': { name: 'Acción', slug: 'accion', icon: '⚔️' },
  'role-playing-games-rpg': { name: 'RPG', slug: 'rpg', icon: '🗡️' },
  'adventure': { name: 'Aventura', slug: 'aventura', icon: '🗺️' },
  'strategy': { name: 'Estrategia', slug: 'estrategia', icon: '♟️' },
  'sports': { name: 'Deportes', slug: 'deportes', icon: '⚽' },
  'indie': { name: 'Indie', slug: 'indie', icon: '🎮' },
  'racing': { name: 'Carreras', slug: 'carreras', icon: '🏎️' },
  'shooter': { name: 'Shooter', slug: 'shooter', icon: '🔫' },
  'puzzle': { name: 'Puzzle', slug: 'puzzle', icon: '🧩' },
  'simulation': { name: 'Simulación', slug: 'simulacion', icon: '🏗️' },
  'fighting': { name: 'Lucha', slug: 'lucha', icon: '🥊' },
  'platformer': { name: 'Plataformas', slug: 'plataformas', icon: '🍄' },
}

// ============================================================
// RAWG API helpers
// ============================================================

interface RawgGame {
  id: number
  slug: string
  name: string
  description_raw?: string
  background_image?: string
  background_image_additional?: string
  released?: string
  rating?: number
  ratings_count?: number
  developers?: { id: number; name: string }[]
  publishers?: { id: number; name: string }[]
  genres?: { id: number; name: string; slug: string }[]
  platforms?: { platform: { id: number; name: string; slug: string } }[]
  stores?: { store: { id: number; name: string; slug: string }; url?: string }[]
}

interface RawgYoutube {
  id: number
  name: string
  video_id: string
}

function getApiKey(): string | null {
  return process.env.RAWG_API_KEY || null
}

async function rawgFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No RAWG_API_KEY')
  const searchParams = new URLSearchParams({ key: apiKey, ...params })
  const url = `${RAWG_BASE_URL}${endpoint}?${searchParams}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`RAWG API error: ${response.status}`)
  return response.json()
}

async function fetchGameFromRawg(slug: string): Promise<RawgGame | null> {
  try {
    return await rawgFetch<RawgGame>(`/games/${slug}`)
  } catch {
    console.warn(`Failed to fetch "${slug}" from RAWG`)
    return null
  }
}

async function fetchTrailerUrl(gameId: number): Promise<string | null> {
  try {
    const response = await rawgFetch<{ results: RawgYoutube[] }>(`/games/${gameId}/youtube`)
    const videos = response.results || []
    // Prefer official trailers
    for (const v of videos) {
      const name = v.name.toLowerCase()
      if (name.includes('trailer') || name.includes('official') || name.includes('launch')) {
        return `https://www.youtube.com/embed/${v.video_id}`
      }
    }
    // Fallback to first video
    if (videos.length > 0) {
      return `https://www.youtube.com/embed/${videos[0].video_id}`
    }
  } catch {
    console.warn(`Failed to fetch trailer for game ${gameId}`)
  }
  return null
}

// Convert RAWG image URL to HD version
function toHdImage(url: string | null | undefined, w: number = 1920, h: number = 1080): string {
  if (!url) return ''
  const cropPath = `/crop/${w}/${h}`
  if (url.includes('/media/games/')) {
    return url.replace('/media/games/', `${cropPath}/games/`)
  }
  if (url.includes('/media/screenshots/')) {
    return url.replace('/media/screenshots/', `${cropPath}/screenshots/`)
  }
  return url
}

function mapRawgToGame(rawgGame: RawgGame, categoryId: string, trailerUrl?: string, downloadUrl?: string) {
  const platforms = rawgGame.platforms
    ? rawgGame.platforms.map(p => {
        const n = p.platform.name
        if (n.includes('PC')) return 'PC'
        if (n.includes('PlayStation')) return 'PlayStation'
        if (n.includes('Xbox')) return 'Xbox'
        if (n.includes('Nintendo') || n.includes('Switch')) return 'Nintendo Switch'
        if (n.includes('macOS')) return 'Mac'
        if (n.includes('Linux')) return 'Linux'
        return n
      }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).join(', ')
    : 'Multiplataforma'

  let description = rawgGame.description_raw || ''
  if (description.length > 500) description = description.substring(0, 497) + '...'
  if (!description) description = `${rawgGame.name} es uno de los títulos más populares en su género. Descubre por qué millones de jugadores lo disfrutan.`

  // HD images from RAWG CDN - imageUrl for cards (600x400), coverUrl for detail (1920x1080)
  const imageUrl = toHdImage(rawgGame.background_image, 600, 400) || rawgGame.background_image || ''
  const coverUrl = toHdImage(rawgGame.background_image_additional || rawgGame.background_image, 1920, 1080)

  return {
    title: rawgGame.name,
    slug: rawgGame.slug,
    description,
    imageUrl,
    coverUrl,
    trailerUrl: trailerUrl || null,
    downloadUrl: downloadUrl || null,
    developer: rawgGame.developers?.[0]?.name || 'Desconocido',
    publisher: rawgGame.publishers?.[0]?.name || 'Desconocido',
    releaseDate: rawgGame.released || 'TBA',
    rating: rawgGame.rating ? Math.min(Math.round(rawgGame.rating * 10) / 10, 5) : 0,
    ratingCount: rawgGame.ratings_count || 0,
    categoryId,
    platforms,
    featured: FEATURED_SLUGS.has(rawgGame.slug),
  }
}

function getDownloadUrl(rawgGame: RawgGame): string | null {
  if (!rawgGame.stores || rawgGame.stores.length === 0) return null
  // Prefer Steam
  const steam = rawgGame.stores.find(s => s.store.slug === 'steam')
  if (steam?.url) return steam.url
  const epic = rawgGame.stores.find(s => s.store.slug === 'epic-games')
  if (epic?.url) return epic.url
  const gog = rawgGame.stores.find(s => s.store.slug === 'gog')
  if (gog?.url) return gog.url
  const nintendo = rawgGame.stores.find(s => s.store.slug === 'nintendo')
  if (nintendo?.url) return nintendo.url
  const ps = rawgGame.stores.find(s => s.store.slug === 'playstation-store')
  if (ps?.url) return ps.url
  const xbox = rawgGame.stores.find(s => s.store.slug === 'xbox-store')
  if (xbox?.url) return xbox.url
  return rawgGame.stores[0]?.url || null
}

function getPrimaryGenre(rawgGame: RawgGame): { name: string; slug: string; icon: string } | null {
  if (!rawgGame.genres || rawgGame.genres.length === 0) return null
  for (const genre of rawgGame.genres) {
    const mapped = GENRE_MAP[genre.slug]
    if (mapped) return mapped
  }
  return null
}

// ============================================================
// Main seed function
// ============================================================

async function main() {
  console.log('🌱 Starting NexusApp seed...')

  // 1. Create categories
  console.log('📁 Creating categories...')
  const categoryMap = new Map<string, ReturnType<typeof GENRE_MAP[keyof typeof GENRE_MAP]>>()

  for (const [, catData] of Object.entries(GENRE_MAP)) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: { name: catData.name, slug: catData.slug, icon: catData.icon },
    })
    categoryMap.set(catData.slug, { ...catData, ...category })
  }

  // 2. Create users
  console.log('👤 Creating users...')
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

  // 3. Create games - PREFER RAWG API for guaranteed consistency
  const apiKey = getApiKey()
  let gamesCreated = 0
  let gamesSkipped = 0

  if (apiKey) {
    console.log(`🎮 Fetching ${GAME_SLUGS.length} games from RAWG API (guaranteed data consistency)...`)

    for (let i = 0; i < GAME_SLUGS.length; i++) {
      const slug = GAME_SLUGS[i]

      try {
        // Check if game already exists
        const existing = await prisma.game.findFirst({ where: { slug } })
        if (existing) {
          gamesSkipped++
          continue
        }

        // Fetch game data from RAWG - ONE API call = ONE game = ALL data consistent
        const rawgGame = await fetchGameFromRawg(slug)
        if (!rawgGame || !rawgGame.background_image) {
          console.warn(`  ⚠️ Skipping "${slug}": not found or no image on RAWG`)
          continue
        }

        // Get genre → category
        const genreInfo = getPrimaryGenre(rawgGame)
        if (!genreInfo) {
          console.warn(`  ⚠️ Skipping "${slug}": no matching genre`)
          continue
        }

        const category = categoryMap.get(genreInfo.slug)
        if (!category) {
          console.warn(`  ⚠️ Skipping "${slug}": category not in DB`)
          continue
        }

        // Fetch trailer URL
        let trailerUrl: string | null = null
        try {
          trailerUrl = await fetchTrailerUrl(rawgGame.id)
        } catch {
          // Trailer is optional
        }

        // Get download URL from the SAME game's store data
        const downloadUrl = getDownloadUrl(rawgGame)

        // Map RAWG game to our data
        const gameData = mapRawgToGame(rawgGame, (category as any).id, trailerUrl || undefined, downloadUrl || undefined)

        await prisma.game.create({ data: gameData })
        gamesCreated++
        console.log(`  ✅ ${rawgGame.name} (cover + name + link all from same game)`)

        // Rate limiting: RAWG allows ~4 req/sec on free tier
        if ((i + 1) % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1100))
        }
      } catch (error) {
        console.error(`  ❌ Error with "${slug}":`, error)
      }
    }

    console.log(`📊 RAWG sync: ${gamesCreated} created, ${gamesSkipped} already existed`)
  } else {
    console.log('⚠️ No RAWG_API_KEY found. Creating games with placeholder data...')
    console.log('💡 Get a free key at https://rawg.io/apidocs for real game data with correct covers')

    // Fallback: create games with placeholder images
    // These will be replaced when RAWG sync is run
    const fallbackGames = [
      { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', developer: 'CD Projekt Red', publisher: 'CD Projekt', rating: 4.2, ratingCount: 156, categorySlug: 'rpg', platforms: 'PC, PlayStation, Xbox', releaseDate: '2020-12-10', featured: true, description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad.' },
      { title: 'Elden Ring', slug: 'elden-ring', developer: 'FromSoftware', publisher: 'Bandai Namco', rating: 4.8, ratingCount: 230, categorySlug: 'rpg', platforms: 'PC, PlayStation, Xbox', releaseDate: '2022-02-25', featured: true, description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros y jefes épicos.' },
      { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', rating: 4.7, ratingCount: 189, categorySlug: 'accion', platforms: 'PlayStation, PC', releaseDate: '2022-11-09', featured: true, description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico.' },
      { title: 'The Legend of Zelda: Tears of the Kingdom', slug: 'the-legend-of-zelda-tears-of-the-kingdom', developer: 'Nintendo EPD', publisher: 'Nintendo', rating: 4.9, ratingCount: 275, categorySlug: 'aventura', platforms: 'Nintendo Switch', releaseDate: '2023-05-12', featured: true, description: 'La secuela de Breath of the Wild lleva a Link a explorar islas flotantes, cavernas subterráneas y un Hyrule transformado con nuevas habilidades.' },
      { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', developer: 'Larian Studios', publisher: 'Larian Studios', rating: 4.8, ratingCount: 312, categorySlug: 'rpg', platforms: 'PC, PlayStation, Xbox', releaseDate: '2023-08-03', featured: true, description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados." },
      { title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong', developer: 'Team Cherry', publisher: 'Team Cherry', rating: 4.7, ratingCount: 67, categorySlug: 'indie', platforms: 'PC, Nintendo Switch', releaseDate: '2025-02-01', featured: true, description: 'La esperada secuela de Hollow Knight. Juega como Hornet en una nueva aventura a través de un reino completamente nuevo.' },
      { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', developer: 'Capcom', publisher: 'Capcom', rating: 4.5, ratingCount: 178, categorySlug: 'accion', platforms: 'PC, PlayStation, Xbox', releaseDate: '2023-03-24', featured: true, description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente.' },
      { title: 'Forza Horizon 5', slug: 'forza-horizon-5', developer: 'Playground Games', publisher: 'Xbox Game Studios', rating: 4.4, ratingCount: 145, categorySlug: 'carreras', platforms: 'PC, Xbox', releaseDate: '2021-11-09', featured: true, description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha.' },
      { title: 'Starfield', slug: 'starfield', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', rating: 3.9, ratingCount: 167, categorySlug: 'aventura', platforms: 'PC, Xbox', releaseDate: '2023-09-06', featured: false, description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial.' },
      { title: 'Hades II', slug: 'hades-ii', developer: 'Supergiant Games', publisher: 'Supergiant Games', rating: 4.6, ratingCount: 98, categorySlug: 'accion', platforms: 'PC', releaseDate: '2024-05-06', featured: false, description: 'Hades II es la secuela del rogue-like aclamado por la crítica. Juega como Melinoë en su búsqueda para derrotar a Chronos.' },
      { title: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', developer: 'Rockstar Games', publisher: 'Rockstar Games', rating: 4.8, ratingCount: 250, categorySlug: 'aventura', platforms: 'PC, PlayStation, Xbox', releaseDate: '2019-11-05', featured: true, description: 'América, 1899. La era del salvaje oeste está llegando a su fin. Tras un robo que sale mal en la ciudad de Blackwater, Arthur Morgan y la banda de Van der Linde se ven obligados a huir.' },
      { title: 'The Witcher 3: Wild Hunt', slug: 'the-witcher-3-wild-hunt', developer: 'CD Projekt Red', publisher: 'CD Projekt', rating: 4.7, ratingCount: 300, categorySlug: 'rpg', platforms: 'PC, PlayStation, Xbox, Nintendo Switch', releaseDate: '2015-05-19', featured: true, description: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos.' },
      { title: 'Black Myth: Wukong', slug: 'black-myth-wukong', developer: 'Game Science', publisher: 'Game Science', rating: 4.6, ratingCount: 180, categorySlug: 'accion', platforms: 'PC, PlayStation', releaseDate: '2024-08-20', featured: true, description: 'Un RPG de acción basado en la mitología china. Juega como el Rey Mono en una aventura épica llena de combate intenso y jefes desafiantes.' },
      { title: 'Hogwarts Legacy', slug: 'hogwarts-legacy', developer: 'Avalanche Software', publisher: 'Warner Bros. Games', rating: 4.3, ratingCount: 200, categorySlug: 'aventura', platforms: 'PC, PlayStation, Xbox, Nintendo Switch', releaseDate: '2023-02-10', featured: true, description: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico.' },
      { title: 'Ghost of Tsushima', slug: 'ghost-of-tsushima', developer: 'Sucker Punch Productions', publisher: 'Sony Interactive', rating: 4.6, ratingCount: 175, categorySlug: 'aventura', platforms: 'PlayStation, PC', releaseDate: '2020-07-17', featured: true, description: 'En 1274, los mongoles invaden la isla de Tsushima. Jin Sakai debe sacrificarse para proteger su hogar y convertirse en el Fantasma de Tsushima.' },
      { title: 'Grand Theft Auto V', slug: 'grand-theft-auto-v', developer: 'Rockstar North', publisher: 'Rockstar Games', rating: 4.5, ratingCount: 400, categorySlug: 'accion', platforms: 'PC, PlayStation, Xbox', releaseDate: '2015-04-14', featured: false, description: 'El mundo abierto de Los Santos y Blaine County te espera. Tres criminales diferentes, una búsqueda de supervivencia en la ciudad más peligrosa de América.' },
    ]

    for (const game of fallbackGames) {
      const existing = await prisma.game.findFirst({ where: { slug: game.slug } })
      if (existing) continue

      const category = categoryMap.get(game.categorySlug)
      if (!category) continue

      // Use placeholder images that indicate the game needs RAWG sync
      // These will be replaced when RAWG sync is run
      const slugForPlaceholder = game.slug.replace(/-/g, '+')
      await prisma.game.create({
        data: {
          title: game.title,
          slug: game.slug,
          description: game.description,
          imageUrl: `https://placehold.co/600x400/1a1a1a/666666?text=${encodeURIComponent(game.title)}`,
          coverUrl: `https://placehold.co/1920x1080/1a1a1a/444444?text=${encodeURIComponent(game.title)}`,
          trailerUrl: null,
          downloadUrl: null,
          developer: game.developer,
          publisher: game.publisher,
          releaseDate: game.releaseDate,
          rating: game.rating,
          ratingCount: game.ratingCount,
          categoryId: (category as any).id,
          platforms: game.platforms,
          featured: game.featured,
        },
      })
      gamesCreated++
    }
    console.log(`📊 Created ${gamesCreated} games with placeholder images`)
    console.log('💡 Run RAWG sync (POST /api/sync-rawg) to replace with real covers!')
  }

  // 4. Create reviews
  console.log('⭐ Creating reviews...')
  const allGames = await prisma.game.findMany({ take: 20 })

  const reviewData = [
    { user: user1, rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable. Night City es una obra de arte visual.' },
    { user: user2, rating: 5, comment: 'Una obra maestra de FromSoftware. El mundo abierto perfecto para su fórmula. Cada jefe es un desafío épico que te hace querer mejorar constantemente.' },
    { user: user3, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Combate mejorado, historia conmovedora y gráficos impresionantes. El juego que PlayStation necesitaba.' },
    { user: user4, rating: 5, comment: 'Nintendo lo volvió a hacer. Las nuevas mecánicas de construcción son geniales y el mundo es infinitamente creativo. Horas y horas de diversión garantizadas.' },
    { user: user1, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante. Larian ha creado algo especial.' },
    { user: user2, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. El combate es más fluido y los gráficos son impresionantes.' },
    { user: user3, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. Melinoë es un personaje increíble y el combate es más profundo y satisfactorio que nunca.' },
    { user: user4, rating: 5, comment: 'La espera valió la pena. Hornet se siente diferente a jugar que el Caballero y el mundo es aún más hermoso y misterioso.' },
    { user: user1, rating: 4, comment: 'El mejor juego de carreras en mundo abierto. México es un escenario espectacular y la variedad de coches es impresionante.' },
    { user: user2, rating: 3, comment: 'Ambicioso pero con altibajos. La exploración espacial es inmersiva pero las misiones repetitivas y los planetas vacíos bajan la experiencia.' },
    { user: user3, rating: 5, comment: 'Red Dead Redemption 2 es una experiencia narrativa sin igual. El mundo abierto es el más vivo y detallado que he visto. Arthur Morgan es inolvidable.' },
    { user: user4, rating: 5, comment: 'The Witcher 3 sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que los argumentos principales de otros juegos.' },
    { user: user1, rating: 5, comment: 'Black Myth: Wukong es una revelación. El combate es adictivo, los jefes son espectaculares y la mitología china le da una frescura increíble.' },
    { user: user2, rating: 4, comment: 'Hogwarts Legacy hace justicia al mundo mágico. Explorar el castillo es una delicia y el sistema de hechizos es divertido.' },
    { user: user3, rating: 5, comment: 'Ghost of Tsushima es poesía visual. El combate con katana es elegante y la historia de Jin Sakai es conmovedora y épica.' },
    { user: user4, rating: 4, comment: 'GTA V sigue siendo entretenido después de todos estos años. La ciudad de Los Santos es increíblemente detallada.' },
  ]

  for (let i = 0; i < Math.min(allGames.length, reviewData.length); i++) {
    const game = allGames[i]
    const r = reviewData[i]
    if (game && r) {
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

  // 5. Create favorites
  console.log('❤️ Creating favorites...')
  const favoriteData = [
    { userId: user1.id, gameIndices: [0, 2, 4, 8, 11, 14] },
    { userId: user2.id, gameIndices: [1, 3, 5, 7, 10, 12] },
    { userId: user3.id, gameIndices: [0, 4, 6, 9, 13, 15] },
    { userId: user4.id, gameIndices: [2, 3, 7, 11, 14] },
  ]

  for (const fav of favoriteData) {
    for (const idx of fav.gameIndices) {
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

  const totalGames = await prisma.game.count()
  console.log(`\n✅ Seed completed! Total games in DB: ${totalGames}`)
  if (!apiKey) {
    console.log('\n🔑 IMPORTANT: Add RAWG_API_KEY to your .env and run the sync endpoint:')
    console.log('   POST /api/sync-rawg { "reset": true }')
    console.log('   This will replace placeholder images with real game covers!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
