import type { Game, Category, Review, Favorite } from '@/types'

const BASE_URL = ''

// Auth token getter support
let _authTokenGetter: (() => Promise<string | null>) | null = null

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _authTokenGetter = getter
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = _authTokenGetter ? await _authTokenGetter() : null
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const api = {
  games: {
    list: async (params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Promise<Game[]> => {
      const searchParams = new URLSearchParams()
      if (params?.category && params.category !== 'all') searchParams.set('category', params.category)
      if (params?.search) searchParams.set('search', params.search)
      if (params?.sort) searchParams.set('sort', params.sort)
      if (params?.featured !== undefined) searchParams.set('featured', String(params.featured))
      const res = await fetch(`${BASE_URL}/api/games?${searchParams}`)
      if (!res.ok) throw new Error('Error fetching games')
      return res.json()
    },
    getById: async (id: string): Promise<Game> => {
      const res = await fetch(`${BASE_URL}/api/games/${id}`)
      if (!res.ok) throw new Error('Error fetching game')
      return res.json()
    },
  },
  categories: {
    list: async (): Promise<Category[]> => {
      const res = await fetch(`${BASE_URL}/api/categories`)
      if (!res.ok) throw new Error('Error fetching categories')
      return res.json()
    },
  },
  favorites: {
    list: async (userId: string): Promise<Favorite[]> => {
      const res = await fetch(`${BASE_URL}/api/favorites?userId=${userId}`)
      if (!res.ok) throw new Error('Error fetching favorites')
      return res.json()
    },
    toggle: async (userId: string, gameId: string): Promise<{ added?: boolean; removed?: boolean }> => {
      const headers = await getAuthHeaders()
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, gameId }),
      })
      if (!res.ok) throw new Error('Error toggling favorite')
      return res.json()
    },
  },
  reviews: {
    list: async (gameId: string): Promise<Review[]> => {
      const res = await fetch(`${BASE_URL}/api/reviews?gameId=${gameId}`)
      if (!res.ok) throw new Error('Error fetching reviews')
      return res.json()
    },
    create: async (data: { userId: string; gameId: string; rating: number; comment: string }): Promise<Review> => {
      const headers = await getAuthHeaders()
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error creating review')
      return res.json()
    },
  },
  users: {
    getByEmail: async (email: string): Promise<{ id: string; name: string; email: string; avatar?: string; role?: string }> => {
      const res = await fetch(`${BASE_URL}/api/users?email=${email}`)
      if (!res.ok) throw new Error('Error fetching user')
      return res.json()
    },
    upsert: async (data: { name: string; email: string; avatar?: string }): Promise<{ id: string; name: string; email: string; avatar?: string; role?: string }> => {
      const headers = await getAuthHeaders()
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error creating/updating user')
      return res.json()
    },
  },
}
