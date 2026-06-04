'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, Calendar, Monitor, Play, Download, PenLine, Star, ExternalLink } from 'lucide-react'
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

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  if (!url) return null
  // Embed format: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (embedMatch) return embedMatch[1]
  // Watch format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return watchMatch[1]
  // Short format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]
  return null
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
  const youtubeId = getYouTubeId(game.trailerUrl || '')
  const trailerThumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : null

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
              className="w-64 h-80 object-cover rounded-xl shadow-2xl shadow-white/5 border border-white/10"
            />
          </div>

          {/* Game Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="inline-block px-3 py-1 bg-white/10 text-gray-200 rounded-full text-sm font-medium mb-3 border border-white/10 hover:bg-white/10">
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
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-white/10'
                )}
              >
                <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg px-4 py-2 border border-white/10">
                <span className="text-3xl font-bold text-white">{game.rating}</span>
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
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-colors shadow-lg shadow-white/10 h-12"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {showTrailer ? 'Ocultar Trailer' : 'Ver Trailer'}
                </Button>
              )}
              {game.downloadUrl && (
                <a
                  href={game.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors shadow-lg shadow-white/5 text-white"
                >
                  <Download className="w-5 h-5" />
                  Descargar
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              <Button
                onClick={handleWriteReview}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border-white/10 h-12"
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

        {/* Trailer Section */}
        {game.trailerUrl && (
          <div className="mt-8">
            {showTrailer ? (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-white fill-current" />
                  Trailer
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <iframe
                    src={game.trailerUrl}
                    title={`${game.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTrailer(true)}
                className="group relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
              >
                {/* Trailer thumbnail or game image */}
                <img
                  src={trailerThumbnail || game.coverUrl || game.imageUrl}
                  alt={`${game.title} Trailer`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-black fill-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-sm font-medium border border-white/10">
                    Ver Trailer
                  </span>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-white fill-white" />
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
