export interface DownloadLink {
  id: string
  gameId: string
  label: string
  url: string
  type: string
  server: string
  fileSize?: string | null
  quality?: string | null
  createdAt: string
}

export interface Game {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string
  coverUrl?: string | null
  trailerUrl?: string | null
  downloadUrl?: string | null
  fileSize?: string | null
  developer: string
  publisher: string
  releaseDate: string
  rating: number
  ratingCount: number
  categoryId: string
  category: Category
  platforms: string
  featured: boolean
  createdAt: string
  reviews: Review[]
  downloadLinks: DownloadLink[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
  _count?: { games: number }
}

export interface Review {
  id: string
  userId: string
  gameId: string
  rating: number
  comment: string
  createdAt: string
  user: { id: string; name: string; avatar: string }
}

export interface Favorite {
  id: string
  userId: string
  gameId: string
  game: Game
}
