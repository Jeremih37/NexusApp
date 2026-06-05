// RAWG API Service - https://rawg.io/apidocs
// Provides real game data: covers, trailers, ratings, platforms, etc.
// All data comes from a single API call per game, ensuring consistency

const RAWG_BASE_URL = 'https://api.rawg.io/api'

interface RawgGame {
  id: number
  slug: string
  name: string
  description_raw?: string
  background_image?: string
  background_image_additional?: string
  released?: string
  rating?: number
  rating_top?: number
  ratings_count?: number
  developers?: { id: number; name: string }[]
  publishers?: { id: number; name: string }[]
  genres?: { id: number; name: string; slug: string }[]
  platforms?: { platform: { id: number; name: string; slug: string } }[]
  stores?: { store: { id: number; name: string; slug: string }; url?: string }[]
  clip?: string | null
}

interface RawgMovie {
  id: number
  name: string
  data: {
    '480': string
    max: string
  }
  preview?: string
}

interface RawgYoutube {
  id: number
  name: string
  video_id: string
  thumbnail?: string
}

interface RawgListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Genre mapping: RAWG genre slug → our category data
const GENRE_CATEGORY_MAP: Record<string, { name: string; slug: string; icon: string }> = {
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
  'casual': { name: 'Casual', slug: 'casual', icon: '🎯' },
}

// All game slugs - each one fetches its OWN data from RAWG
// This guarantees that cover, name, and link all match the same game
const ALL_GAME_SLUGS = [
  // Featured games (appear on homepage)
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
  // Additional games
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
  // More popular games
  'grand-theft-auto-vi',
  'dragons-dogma-2',
  'helldivers-2',
  'palworld',
  'like-a-dragon-infinite-wealth',
  'prince-of-persia-the-lost-crown',
  'tekken-8',
  'alone-in-the-dark-2024',
  'banishers-ghosts-of-new-eden',
  'dragon-age-the-veilguard',
  'silkong-2',
  'batman-arkham-knight',
  'the-elder-scrolls-v-skyrim',
  'portal-2',
  'half-life-2',
  'left-4-dead-2',
  'team-fortress-2',
  'counter-strike-2',
  'dota-2',
  'league-of-legends',
  'genshin-impact',
  'honkai-star-rail',
  'bioshock-infinite',
  'tomb-raider-2013',
  'shadow-of-the-colossus',
  'metal-gear-solid-v-the-phantom-pain',
  'fire-emblem-engage',
  ' pikmin-4',
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

function getApiKey(): string {
  const key = process.env.RAWG_API_KEY
  if (!key) {
    throw new Error('RAWG_API_KEY is not configured. Get a free key at https://rawg.io/apidocs')
  }
  return key
}

function hasApiKey(): boolean {
  return !!process.env.RAWG_API_KEY
}

async function rawgFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey()
  const searchParams = new URLSearchParams({ key: apiKey, ...params })
  const url = `${RAWG_BASE_URL}${endpoint}?${searchParams}`

  const response = await fetch(url, { next: { revalidate: 3600 } })

  if (!response.ok) {
    console.error(`RAWG API error: ${response.status} ${response.statusText} for ${url}`)
    throw new Error(`RAWG API error: ${response.status}`)
  }

  return response.json()
}

// Fetch a single game by slug - ALL data comes from ONE API call
// This ensures the name, cover image, and store links all belong to the SAME game
async function getGameBySlug(slug: string): Promise<RawgGame | null> {
  try {
    return await rawgFetch<RawgGame>(`/games/${slug}`)
  } catch (error) {
    console.warn(`Failed to fetch game "${slug}" from RAWG:`, error)
    return null
  }
}

// Fetch YouTube trailers for a game
async function getGameTrailers(gameId: number): Promise<RawgYoutube[]> {
  try {
    const response = await rawgFetch<RawgListResponse<RawgYoutube>>(
      `/games/${gameId}/youtube`
    )
    return response.results || []
  } catch (error) {
    console.warn(`Failed to fetch trailers for game ${gameId}:`, error)
    return []
  }
}

// Fetch game movies (official clips) for a game
async function getGameMovies(gameId: number): Promise<RawgMovie[]> {
  try {
    const response = await rawgFetch<RawgListResponse<RawgMovie>>(
      `/games/${gameId}/movies`
    )
    return response.results || []
  } catch (error) {
    console.warn(`Failed to fetch movies for game ${gameId}:`, error)
    return []
  }
}

/**
 * Convert a RAWG image URL to an HD version.
 * RAWG CDN only supports /media/crop/600/400/ reliably. Larger crops return 307→404.
 * Original:    https://media.rawg.io/media/games/abc/abc123.jpg
 * Thumbnail:   https://media.rawg.io/media/crop/600/400/games/abc/abc123.jpg  (works)
 * HD cover:    https://media.rawg.io/media/screenshots/abc/abc123.jpg          (full-size, works)
 */
function getHdImageUrl(rawgUrl: string | null | undefined, width: number = 600, height: number = 400): string {
  if (!rawgUrl) return ''
  // Only /media/crop/600/400/ works reliably on RAWG CDN
  // For larger sizes, return the original full-size image instead
  if (width > 600 || height > 400) {
    // Return the original /media/ URL without crop (full resolution, already HD)
    return rawgUrl
  }
  // Insert /crop/600/400 AFTER /media/ and BEFORE /games/ or /screenshots/
  // Result: /media/crop/600/400/games/...  (NOT /crop/600/400/games/... which 404s)
  const cropPath = `/media/crop/${width}/${height}`
  if (rawgUrl.includes('/media/games/')) {
    return rawgUrl.replace('/media/games/', `${cropPath}/games/`)
  }
  if (rawgUrl.includes('/media/screenshots/')) {
    return rawgUrl.replace('/media/screenshots/', `${cropPath}/screenshots/`)
  }
  // If we can't parse the URL, return as-is
  return rawgUrl
}

// Convert RAWG game to our game data format
// ALL data comes from one RawgGame object, ensuring consistency
function mapRawgGameToGameData(
  rawgGame: RawgGame,
  categoryId: string,
  trailerUrl?: string,
  downloadUrl?: string,
) {
  const platforms = rawgGame.platforms
    ? rawgGame.platforms.map((p) => {
        // Simplify platform names
        const name = p.platform.name
        if (name.includes('PC')) return 'PC'
        if (name.includes('PlayStation')) return 'PlayStation'
        if (name.includes('Xbox')) return 'Xbox'
        if (name.includes('Nintendo') || name.includes('Switch')) return 'Nintendo Switch'
        if (name.includes('macOS')) return 'Mac'
        if (name.includes('Linux')) return 'Linux'
        return name
      })
        .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
        .slice(0, 4)
        .join(', ')
    : 'Multiplataforma'

  const developer = rawgGame.developers?.[0]?.name || 'Desconocido'
  const publisher = rawgGame.publishers?.[0]?.name || 'Desconocido'

  // Use HD image URLs from RAWG CDN
  // imageUrl = main cover (card thumbnail) - use 600x400 crop for clean cards
  // coverUrl = HD background for detail page - full-size original image (crop > 600/400 doesn't work on RAWG)
  const imageUrl = getHdImageUrl(rawgGame.background_image, 600, 400) || rawgGame.background_image || ''
  const coverUrl = rawgGame.background_image_additional || rawgGame.background_image || ''

  // Clean up description - remove excessive whitespace
  let description = rawgGame.description_raw || ''
  if (description.length > 500) {
    description = description.substring(0, 497) + '...'
  }
  if (!description) {
    description = `${rawgGame.name} es uno de los títulos más populares en su género. Descubre por qué millones de jugadores lo disfrutan.`
  }

  return {
    title: rawgGame.name,
    slug: rawgGame.slug,
    description,
    imageUrl,
    coverUrl,
    trailerUrl: trailerUrl || null,
    downloadUrl: downloadUrl || null,
    developer,
    publisher,
    releaseDate: rawgGame.released || 'TBA',
    rating: rawgGame.rating ? Math.min(Math.round(rawgGame.rating * 10) / 10, 5) : 0,
    ratingCount: rawgGame.ratings_count || 0,
    categoryId,
    platforms,
    featured: false,
  }
}

// Get the primary genre for a game (first genre that matches our mapping)
function getPrimaryGenre(rawgGame: RawgGame): { name: string; slug: string; icon: string } | null {
  if (!rawgGame.genres || rawgGame.genres.length === 0) return null

  for (const genre of rawgGame.genres) {
    const mapped = GENRE_CATEGORY_MAP[genre.slug]
    if (mapped) return mapped
  }

  return null
}

// Get all unique genres from a list of RAWG games
function getAllGenres(games: RawgGame[]): Map<string, { name: string; slug: string; icon: string }> {
  const genreMap = new Map<string, { name: string; slug: string; icon: string }>()
  for (const game of games) {
    if (game.genres) {
      for (const genre of game.genres) {
        const mapped = GENRE_CATEGORY_MAP[genre.slug]
        if (mapped && !genreMap.has(mapped.slug)) {
          genreMap.set(mapped.slug, mapped)
        }
      }
    }
  }
  return genreMap
}

// Get the best trailer URL for a game (YouTube embed)
async function getBestTrailerUrl(gameId: number): Promise<string | null> {
  // First try YouTube trailers
  const youtubeVideos = await getGameTrailers(gameId)

  for (const video of youtubeVideos) {
    const name = video.name.toLowerCase()
    // Prefer official trailers
    if (name.includes('trailer') || name.includes('official') || name.includes('launch') || name.includes('reveal')) {
      return `https://www.youtube.com/embed/${video.video_id}`
    }
  }

  // If no trailer found, use the first YouTube video if available
  if (youtubeVideos.length > 0) {
    return `https://www.youtube.com/embed/${youtubeVideos[0].video_id}`
  }

  return null
}

// Get download URL from stores - these come from the SAME game's RAWG data
function getDownloadUrl(rawgGame: RawgGame): string | null {
  if (!rawgGame.stores || rawgGame.stores.length === 0) return null

  // Prefer Steam
  const steam = rawgGame.stores.find(s => s.store.slug === 'steam')
  if (steam?.url) return steam.url

  // Then other stores
  const epic = rawgGame.stores.find(s => s.store.slug === 'epic-games')
  if (epic?.url) return epic.url

  const gog = rawgGame.stores.find(s => s.store.slug === 'gog')
  if (gog?.url) return gog.url

  const nintendo = rawgGame.stores.find(s => s.store.slug === 'nintendo')
  if (nintendo?.url) return nintendo.url

  const xbox = rawgGame.stores.find(s => s.store.slug === 'xbox-store')
  if (xbox?.url) return xbox.url

  const ps = rawgGame.stores.find(s => s.store.slug === 'playstation-store')
  if (ps?.url) return ps.url

  // Any store URL
  return rawgGame.stores[0]?.url || null
}

export const rawgService = {
  getGameBySlug,
  getGameTrailers,
  getGameMovies,
  getBestTrailerUrl,
  getDownloadUrl,
  mapRawgGameToGameData,
  getPrimaryGenre,
  getAllGenres,
  getHdImageUrl,
  hasApiKey,
  ALL_GAME_SLUGS,
  FEATURED_SLUGS,
  GENRE_CATEGORY_MAP,
}
