'use client'

import { Star } from 'lucide-react'
import { GameCard } from './game-card'
import { useGames, useFavorites, useToggleFavorite } from '@/hooks/use-games'

export function FeaturedSection() {
  const { data: games = [], isLoading } = useGames({ sort: 'rating' })
  const { data: favorites = [] } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  if (isLoading) return null

  const featuredGames = games.filter((g) => g.featured).slice(0, 6)

  if (featuredGames.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-white fill-white" />
          Juegos Destacados
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            variant="featured"
            isFavorite={favorites.includes(game.id)}
            onToggleFavorite={(gameId) => toggleFavorite.mutate(gameId)}
          />
        ))}
      </div>
    </section>
  )
}
