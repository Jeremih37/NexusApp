'use client'

import Link from 'next/link'
import { Star, Heart, Monitor, Play, Download, TrendingUp } from 'lucide-react'
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
        className="group cursor-pointer glass-card rounded-2xl overflow-hidden card-lift relative"
      >
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))' }}
        />

        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 glass-dark rounded-full px-3 py-1.5 badge-glow">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
            <span className="text-sm font-bold">{game.rating}</span>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 glass-dark rounded-full text-xs font-semibold tracking-wide uppercase">
              {game.category.name}
            </span>
          </div>

          {/* Featured indicator */}
          {game.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-black">
                <TrendingUp className="w-3 h-3" />
                DESTACADO
              </span>
            </div>
          )}
        </div>

        <div className="p-5 relative z-10">
          <h3 className="font-bold text-lg mb-1.5 group-hover:text-white transition-colors line-clamp-1">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{game.developer}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Monitor className="w-3.5 h-3.5" />
              {game.platforms}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className={cn(
                'p-2 rounded-full transition-all',
                isFavorite
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
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
        className="group cursor-pointer glass-card rounded-2xl overflow-hidden card-lift relative"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 glass-dark rounded-full px-3 py-1.5">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
            <span className="text-sm font-bold">{game.rating}</span>
          </div>
        </div>

        <div className="p-5 relative z-10">
          <h3 className="font-bold mb-1.5 group-hover:text-white transition-colors truncate">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{game.developer}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 glass-card px-2.5 py-1 rounded-full">{game.category.name}</span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </Link>
    )
  }

  // catalog variant (default) - most premium
  return (
    <Link
      href={`/game/${game.id}`}
      className="group cursor-pointer glass-card rounded-2xl overflow-hidden card-lift relative"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent, rgba(255,255,255,0.03))' }}
      />

      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Rating badge with glow */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 glass-dark rounded-full px-3 py-1.5 badge-glow">
          <Star className="w-3.5 h-3.5 text-white fill-white" />
          <span className="text-sm font-bold">{game.rating}</span>
        </div>

        {/* Featured badge */}
        {game.featured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-black">
              <TrendingUp className="w-3 h-3" />
              DESTACADO
            </span>
          </div>
        )}

        {/* Play trailer overlay on hover */}
        {game.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase glass-card px-2.5 py-1 rounded-full">{game.category.name}</span>
          <span className="text-gray-700">&middot;</span>
          <span className="text-xs text-gray-500">{game.releaseDate}</span>
        </div>
        <h3 className="font-bold text-lg mb-1.5 group-hover:text-white transition-colors line-clamp-1">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.developer}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRating rating={game.rating} size="sm" />
            <span className="text-xs text-gray-500 ml-1">({game.ratingCount})</span>
          </div>
          <div className="flex items-center gap-1">
            {game.trailerUrl && (
              <span className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Trailer disponible">
                <Play className="w-4 h-4 fill-current" />
              </span>
            )}
            {game.downloadUrl && (
              <span className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Descarga disponible">
                <Download className="w-4 h-4" />
              </span>
            )}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(game.id) }}
              className={cn(
                'p-2 rounded-lg transition-all',
                isFavorite
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
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
