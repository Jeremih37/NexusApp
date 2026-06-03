'use client'

import Link from 'next/link'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { StarRating } from '@/components/review/star-rating'
import { useGames } from '@/hooks/use-games'
import type { Game } from '@/types'

export function TopRatedSection() {
  const { data: games = [], isLoading } = useGames({ sort: 'rating' })

  if (isLoading) return null

  const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 6)

  if (topRated.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Mejor Calificados
        </h2>
        <Link href="/catalog" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topRated.map((game: Game, idx: number) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="flex gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-purple-500/30 cursor-pointer transition-all group"
          >
            <div className="relative flex-shrink-0">
              <span className="absolute -top-2 -left-2 w-7 h-7 bg-gray-900 border border-purple-500/50 rounded-full flex items-center justify-center text-xs font-bold text-purple-300">
                {idx + 1}
              </span>
              <img src={game.imageUrl} alt={game.title} className="w-16 h-20 object-cover rounded-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm group-hover:text-purple-300 transition-colors truncate">{game.title}</h4>
              <p className="text-xs text-gray-500 mb-1">{game.developer}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={game.rating} size="sm" />
                <span className="text-xs text-amber-400 font-medium">{game.rating}</span>
              </div>
              <span className="text-xs text-gray-600">{game.category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
