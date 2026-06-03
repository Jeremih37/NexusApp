'use client'

import Link from 'next/link'
import { Heart, ChevronRight, Star } from 'lucide-react'
import { useFavoriteGames } from '@/hooks/use-games'

export function FavoritesPreview() {
  const { data: favoriteGames = [], isLoading } = useFavoriteGames()

  if (isLoading || favoriteGames.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400 fill-current" />
          Tus Favoritos
        </h2>
        <Link href="/favorites" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {favoriteGames.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="flex-shrink-0 w-44 cursor-pointer group"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all mb-2">
              <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium">{game.rating}</span>
                </div>
              </div>
            </div>
            <h4 className="text-sm font-medium truncate group-hover:text-red-300 transition-colors">{game.title}</h4>
          </Link>
        ))}
      </div>
    </section>
  )
}
