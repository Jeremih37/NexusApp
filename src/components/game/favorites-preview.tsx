'use client'

import Link from 'next/link'
import { Heart, ChevronRight, Star } from 'lucide-react'
import { useFavoriteGames } from '@/hooks/use-games'

export function FavoritesPreview() {
  const { data: favoriteGames = [], isLoading } = useFavoriteGames()

  if (isLoading || favoriteGames.length === 0) return null

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Tus Favoritos</h2>
            <p className="text-gray-500 text-sm mt-0.5">Juegos que has guardado</p>
          </div>
        </div>
        <Link href="/favorites" className="text-gray-400 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors glass-card px-4 py-2 rounded-full">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        {favoriteGames.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="flex-shrink-0 w-48 cursor-pointer group"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card card-lift">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Rating badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 glass-dark rounded-full px-2.5 py-1">
                <Star className="w-3 h-3 text-white fill-white" />
                <span className="text-xs font-bold">{game.rating}</span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="font-bold text-sm truncate group-hover:text-white transition-colors">{game.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{game.developer}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
