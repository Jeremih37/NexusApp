import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Game, Category, Favorite } from '@/types'

const CURRENT_USER_EMAIL = 'carlos@nexusapp.com'

export function useGames(params?: { category?: string; search?: string; sort?: string }) {
  return useQuery({
    queryKey: ['games', params],
    queryFn: () => api.games.list(params),
  })
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => api.games.getById(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.list(),
  })
}

export function useFavorites(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => api.favorites.list(userId),
    enabled: !!userId,
    select: (data: Favorite[]) => data.map((f) => f.gameId),
  })
}

export function useFavoriteGames(userId: string) {
  const favoritesQuery = useFavorites(userId)
  const gamesQuery = useGames()

  const favoriteIds = favoritesQuery.data ?? []
  const allGames = gamesQuery.data ?? []
  const favoriteGames = allGames.filter((g: Game) => favoriteIds.includes(g.id))

  return {
    ...favoritesQuery,
    data: favoriteGames,
    isLoading: favoritesQuery.isLoading || gamesQuery.isLoading,
  }
}

export function useToggleFavorite(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gameId: string) => api.favorites.toggle(userId, gameId),
    onMutate: async (gameId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', userId] })
      const previousFavorites = queryClient.getQueryData<string[]>(['favorites', userId])

      queryClient.setQueryData<string[]>(['favorites', userId], (old = []) => {
        if (old.includes(gameId)) {
          return old.filter((id: string) => id !== gameId)
        }
        return [...old, gameId]
      })

      return { previousFavorites }
    },
    onError: (_err, _gameId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', userId], context.previousFavorites)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string; gameId: string; rating: number; comment: string }) =>
      api.reviews.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.users.getByEmail(CURRENT_USER_EMAIL),
  })
}
