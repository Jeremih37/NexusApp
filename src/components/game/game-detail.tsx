'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, Calendar, Monitor, Play, Download, PenLine, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/review/star-rating'
import { ReviewList } from '@/components/review/review-list'
import { ReviewModal } from '@/components/review/review-modal'
import { useGame, useFavorites, useToggleFavorite } from '@/hooks/use-games'
import { useAuth } from '@/lib/auth-context'

interface GameDetailProps {
  id: string
}

export function GameDetail({ id }: GameDetailProps) {
  const { data: game, isLoading } = useGame(id)
  const { user, isAuthenticated } = useAuth()
  const { data: favorites = [] } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const [showTrailer, setShowTrailer] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const router = useRouter()

  if (isLoading || !game) {
    return (
      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-gray-800 rounded w-40" />
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-64 h-80 bg-gray-800 rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-800 rounded w-24" />
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isFavorite = favorites.includes(game.id)

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    toggleFavorite.mutate(game.id)
  }

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setShowReviewModal(true)
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={game.coverUrl || game.imageUrl}
          alt={game.title}
          className="w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al catálogo</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Game Image */}
          <div className="flex-shrink-0">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-64 h-80 object-cover rounded-xl shadow-2xl shadow-amber-500/10 border border-gray-700/50"
            />
          </div>

          {/* Game Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="inline-block px-3 py-1 bg-amber-700/20 text-amber-300 rounded-full text-sm font-medium mb-3 border border-amber-500/30 hover:bg-amber-700/20">
                  {game.category.name}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.title}</h1>
                <p className="text-gray-400 text-lg">{game.developer} &middot; {game.publisher}</p>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  'p-3 rounded-full transition-all',
                  isFavorite
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-900 text-gray-400 hover:text-red-400 border border-gray-700'
                )}
              >
                <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg px-4 py-2 border border-gray-700/50">
                <span className="text-3xl font-bold text-amber-400">{game.rating}</span>
                <div className="flex flex-col">
                  <StarRating rating={game.rating} size="sm" />
                  <span className="text-xs text-gray-500 mt-0.5">{game.ratingCount} reseñas</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                {game.releaseDate}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Monitor className="w-4 h-4" />
                {game.platforms}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {game.trailerUrl && (
                <Button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg font-medium transition-colors shadow-lg shadow-amber-500/20 h-12"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Ver Trailer
                </Button>
              )}
              {game.downloadUrl && (
                <a
                  href={game.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-5 h-5" />
                  Descargar
                </a>
              )}
              <Button
                onClick={handleWriteReview}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border-gray-600 h-12"
              >
                <PenLine className="w-5 h-5" />
                Escribir Reseña
              </Button>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-300 leading-relaxed">{game.description}</p>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {showTrailer && game.trailerUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400 fill-current" />
              Trailer
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
              <iframe
                src={game.trailerUrl}
                title={`${game.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Reseñas ({game.reviews?.length || 0})
            </h3>
          </div>
          <ReviewList reviews={game.reviews || []} />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        gameId={game.id}
        gameTitle={game.title}
      />
    </div>
  )
}
