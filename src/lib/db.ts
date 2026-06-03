import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  if (process.env.VERCEL === '1') {
    return 'file:/tmp/nexusapp.db'
  }
  return process.env.DATABASE_URL || 'file:./db/custom.db'
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [],
    datasourceUrl: getDatabaseUrl(),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT
);
CREATE TABLE IF NOT EXISTS "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "coverUrl" TEXT,
    "trailerUrl" TEXT,
    "downloadUrl" TEXT,
    "developer" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Game_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Review_userId_gameId_key" ON "Review"("userId", "gameId");
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_gameId_key" ON "Favorite"("userId", "gameId");
`

let dbInitialized = false

export async function ensureDB() {
  if (dbInitialized) return

  try {
    const count = await db.game.count()
    if (count > 0) { dbInitialized = true; return }
  } catch {
    // Tables don't exist yet
  }

  try {
    // Create schema
    const statements = SCHEMA_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0)
    for (const stmt of statements) {
      await db.$executeRawUnsafe(stmt)
    }

    // Seed data
    const action = await db.category.create({ data: { name: 'Acción', slug: 'accion', icon: '⚔️' } })
    const rpg = await db.category.create({ data: { name: 'RPG', slug: 'rpg', icon: '🗡️' } })
    const adventure = await db.category.create({ data: { name: 'Aventura', slug: 'aventura', icon: '🗺️' } })
    const strategy = await db.category.create({ data: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' } })
    const sports = await db.category.create({ data: { name: 'Deportes', slug: 'deportes', icon: '⚽' } })
    const horror = await db.category.create({ data: { name: 'Terror', slug: 'terror', icon: '👻' } })
    const indie = await db.category.create({ data: { name: 'Indie', slug: 'indie', icon: '🎮' } })
    const racing = await db.category.create({ data: { name: 'Carreras', slug: 'carreras', icon: '🏎️' } })

    const u1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG' } })
    const u2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML' } })
    const u3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })
    const u4 = await db.user.create({ data: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF' } })

    const gamesData = [
      { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', description: 'RPG de mundo abierto en Night City.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.jpg', trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk', downloadUrl: 'https://www.gog.com/en/game/cyberpunk_2077', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10', rating: 4.2, ratingCount: 156, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
      { title: 'Elden Ring', slug: 'elden-ring', description: 'RPG de acción en mundo abierto.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg', trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0', downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25', rating: 4.8, ratingCount: 230, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
      { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', description: 'Kratos y Atreus enfrentan el Ragnarök.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg', trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0', downloadUrl: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09', rating: 4.7, ratingCount: 189, categoryId: action.id, platforms: 'PlayStation, PC', featured: true },
      { title: 'Zelda: Tears of the Kingdom', slug: 'zelda-totk', description: 'Secuela de Breath of the Wild.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl1.jpg', trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo', downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', developer: 'Nintendo EPD', publisher: 'Nintendo', releaseDate: '2023-05-12', rating: 4.9, ratingCount: 275, categoryId: adventure.id, platforms: 'Nintendo Switch', featured: true },
      { title: 'Hades II', slug: 'hades-2', description: 'Secuela del rogue-like con Melinoë.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670x.jpg', trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY', downloadUrl: 'https://store.steampowered.com/app/1145350/Hades_II/', developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06', rating: 4.6, ratingCount: 98, categoryId: action.id, platforms: 'PC', featured: false },
      { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', description: 'RPG basado en D&D 5ª edición.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8', downloadUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/', developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03', rating: 4.8, ratingCount: 312, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
      { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', description: 'Remake del clásico survival horror.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo6.jpg', trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE', downloadUrl: 'https://store.steampowered.com/app/2050650/Resident_Evil_4/', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24', rating: 4.5, ratingCount: 178, categoryId: horror.id, platforms: 'PC, PlayStation, Xbox', featured: false },
      { title: 'Forza Horizon 5', slug: 'forza-horizon-5', description: 'Carreras en mundo abierto.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3v.jpg', trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw', downloadUrl: 'https://www.xbox.com/en-US/games/store/forza-horizon-5/9n7knz5s4spx', developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09', rating: 4.4, ratingCount: 145, categoryId: racing.id, platforms: 'PC, Xbox', featured: false },
      { title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong', description: 'Secuela de Hollow Knight con Hornet.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2tba.jpg', trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg', downloadUrl: 'https://store.steampowered.com/app/1030000/Hollow_Knight_Silksong/', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01', rating: 4.7, ratingCount: 67, categoryId: indie.id, platforms: 'PC, Nintendo Switch', featured: true },
      { title: 'Civilization VII', slug: 'civilization-vii', description: 'Estrategia por turnos.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yxj.jpg', trailerUrl: 'https://www.youtube.com/embed/GbSfHqDh3TM', downloadUrl: 'https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/', developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2025-02-11', rating: 4.1, ratingCount: 52, categoryId: strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
      { title: 'FIFA 25', slug: 'fifa-25', description: 'EA Sports FC 25.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6seq.jpg', trailerUrl: 'https://www.youtube.com/embed/awLGv0MkzjQ', downloadUrl: 'https://www.ea.com/games/ea-sports-fc/fc-25', developer: 'EA Canada', publisher: 'EA Sports', releaseDate: '2024-09-27', rating: 3.8, ratingCount: 94, categoryId: sports.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
      { title: 'Starfield', slug: 'starfield', description: 'RPG espacial de Bethesda.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6gsx.jpg', trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI', downloadUrl: 'https://store.steampowered.com/app/1716740/Starfield/', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06', rating: 3.9, ratingCount: 167, categoryId: adventure.id, platforms: 'PC, Xbox', featured: false },
    ]
    const allGames = []
    for (const g of gamesData) { allGames.push(await db.game.create({ data: g })) }

    await db.review.createMany({ data: [
      { userId: u1.id, gameId: allGames[0].id, rating: 4, comment: 'Increíble mundo abierto.' },
      { userId: u2.id, gameId: allGames[1].id, rating: 5, comment: 'Una obra maestra.' },
      { userId: u3.id, gameId: allGames[2].id, rating: 5, comment: 'Mejor aventura de Kratos.' },
      { userId: u4.id, gameId: allGames[3].id, rating: 5, comment: 'Nintendo lo volvió a hacer.' },
      { userId: u1.id, gameId: allGames[5].id, rating: 5, comment: 'El mejor RPG.' },
      { userId: u2.id, gameId: allGames[6].id, rating: 4, comment: 'Remake excepcional.' },
      { userId: u3.id, gameId: allGames[4].id, rating: 5, comment: 'Combate más profundo.' },
      { userId: u4.id, gameId: allGames[8].id, rating: 5, comment: 'La espera valió la pena.' },
      { userId: u1.id, gameId: allGames[7].id, rating: 4, comment: 'Mejor juego de carreras.' },
      { userId: u2.id, gameId: allGames[11].id, rating: 3, comment: 'Altibajos.' },
      { userId: u3.id, gameId: allGames[9].id, rating: 4, comment: 'Ideas frescas.' },
      { userId: u4.id, gameId: allGames[10].id, rating: 4, comment: 'Mejoras notables.' },
    ] })

    const favMap: Record<string, number[]> = { [u1.id]: [1,3,5,8], [u2.id]: [0,2,4,6], [u3.id]: [1,5,3,7], [u4.id]: [3,8,4,9] }
    for (const [uid, idxs] of Object.entries(favMap)) {
      for (const idx of idxs) {
        if (allGames[idx]) await db.favorite.create({ data: { userId: uid, gameId: allGames[idx].id } })
      }
    }

    console.log('DB auto-seeded on Vercel!')
  } catch (e) {
    console.error('Auto-seed error:', e)
  }

  dbInitialized = true
}
