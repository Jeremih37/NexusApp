'use client'

import Link from 'next/link'
import { Star, Heart, Monitor, Play, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarRating } from '@/components/review/star-rating'
import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  variant?: 'featured' | 'catalog' | 'favorite'
  isFavorite?: boolean
  onToggleFavorite?: (gameId: string) => void
}

export function GameCard({ game, variant = 'catalog', isFavorite = false, onToggleFavorite }: GameCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={`/game/${game.id}`}
        className="group cursor-pointer bg-gray-900/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">{game.rating}</span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-amber-700/80 backdrop-blur-sm rounded-full text-xs font-medium">
              {game.category.name}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-amber-300 transition-colors">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{game.developer}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Monitor className="w-3.5 h-3.5" />
              {game.platforms}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className={cn(
                'p-1.5 rounded-full transition-all',
                isFavorite ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'favorite') {
    return (
      <Link
        href={`/game/${game.id}`}
        className="group cursor-pointer bg-gray-900/40 rounded-xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">{game.rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold mb-1 group-hover:text-red-300 transition-colors truncate">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{game.developer}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400">{game.category.name}</span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className="p-1.5 rounded-full text-red-400 hover:text-red-300 transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </Link>
    )
  }

  // catalog variant (default)
  return (
    <Link
      href={`/game/${game.id}`}
      className="group cursor-pointer bg-gray-900/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium">{game.rating}</span>
        </div>
        {game.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900">
              DESTACADO
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-amber-400 font-medium">{game.category.name}</span>
          <span className="text-gray-700">&middot;</span>
          <span className="text-xs text-gray-500">{game.releaseDate}</span>
        </div>
        <h3 className="font-bold mb-1 group-hover:text-amber-300 transition-colors truncate">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{game.developer}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={game.rating} size="sm" />
            <span className="text-xs text-gray-500 ml-1">({game.ratingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            {game.trailerUrl && (
              <span className="p-1.5 text-gray-500 hover:text-amber-400 transition-colors" title="Trailer disponible">
                <Play className="w-4 h-4 fill-current" />
              </span>
            )}
            {game.downloadUrl && (
              <span className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors" title="Descarga disponible">
                <Download className="w-4 h-4" />
              </span>
            )}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className={cn(
                'p-1.5 rounded-full transition-all',
                isFavorite ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
