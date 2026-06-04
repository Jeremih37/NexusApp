'use client'

import Link from 'next/link'
import { TrendingUp, ChevronRight, Trophy, Flame } from 'lucide-react'
import { StarRating } from '@/components/review/star-rating'
import { useGames } from '@/hooks/use-games'
import type { Game } from '@/types'

export function TopRatedSection() {
  const { data: games = [], isLoading } = useGames({ sort: 'rating' })

  if (isLoading) return null

  const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 6)

  if (topRated.length === 0) return null

  const rankStyles = [
    'from-white/20 to-white/5 border-white/20 text-white',
    'from-white/10 to-white/[0.03] border-white/15 text-gray-200',
    'from-white/[0.08] to-white/[0.02] border-white/10 text-gray-300',
  ]

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Mejor Calificados</h2>
            <p className="text-gray-500 text-sm mt-0.5">Top resenas de los jugadores</p>
          </div>
        </div>
        <Link href="/catalog" className="text-gray-400 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors glass-card px-4 py-2 rounded-full">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-fade">
        {topRated.map((game: Game, idx: number) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="flex gap-4 p-5 glass-card rounded-2xl cursor-pointer card-lift group relative overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), transparent)' }}
            />

            {/* Rank badge */}
            <div className="relative flex-shrink-0">
              <div className={`absolute -top-1 -left-1 w-7 h-7 bg-gradient-to-br ${rankStyles[idx] || 'from-white/[0.05] to-transparent border-white/[0.08] text-gray-400'} border rounded-full flex items-center justify-center text-xs font-black z-10`}>
                {idx + 1}
              </div>
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-18 h-22 object-cover rounded-xl border border-white/[0.08] group-hover:border-white/15 transition-colors"
                style={{ width: '72px', height: '90px' }}
              />
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <h4 className="font-bold text-base group-hover:text-white transition-colors truncate mb-1">{game.title}</h4>
              <p className="text-xs text-gray-500 mb-2">{game.developer}</p>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={game.rating} size="sm" />
                <span className="text-sm text-white font-bold">{game.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs glass-card px-2.5 py-1 rounded-full text-gray-400 font-medium">{game.category.name}</span>
                {idx < 3 && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Flame className="w-3 h-3" />
                    Hot
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
