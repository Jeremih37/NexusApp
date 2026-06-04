'use client'

import { Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
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
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center badge-glow">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Juegos Destacados</h2>
            <p className="text-gray-500 text-sm mt-0.5">Los mas populares de la comunidad</p>
          </div>
        </div>
        <Link href="/catalog" className="text-gray-400 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors glass-card px-4 py-2 rounded-full">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
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
