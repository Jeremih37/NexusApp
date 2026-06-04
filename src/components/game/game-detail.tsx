'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, Calendar, Monitor, Play, Download, PenLine, Star, ExternalLink, Gamepad2, Share2 } from 'lucide-react'
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
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (embedMatch) return embedMatch[1]
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return watchMatch[1]
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
              <div className="w-64 h-80 bg-gray-800 rounded-2xl" />
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
      {/* Cinematic blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={game.coverUrl || game.imageUrl}
          alt={game.title}
          className="w-full h-full object-cover opacity-15 blur-md scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-black" />
        <div className="absolute inset-0 mesh-gradient" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 glass-card px-4 py-2 rounded-full text-gray-400 hover:text-white transition-all mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver al catalogo</span>
        </button>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Game Image */}
          <div className="flex-shrink-0 group">
            <div className="relative">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-72 h-[360px] lg:w-80 lg:h-[420px] object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/[0.08] group-hover:shadow-[0_25px_80px_rgba(0,0,0,0.7)] transition-shadow duration-500"
              />
              {/* Image glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1">
            {/* Category + Favorite */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <Badge className="inline-block px-4 py-1.5 glass-card rounded-full text-sm font-semibold mb-4 border-0 tracking-wide uppercase">
                  <Gamepad2 className="w-3.5 h-3.5 inline mr-1.5" />
                  {game.category.name}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-glow leading-tight">{game.title}</h1>
                <p className="text-gray-400 text-lg">{game.developer} <span className="text-gray-600 mx-2">|</span> {game.publisher}</p>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  'p-3.5 rounded-2xl transition-all flex-shrink-0',
                  isFavorite
                    ? 'glass-card text-white border border-white/15'
                    : 'glass-card text-gray-400 hover:text-white border border-white/[0.06]'
                )}
              >
                <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
              </button>
            </div>

            {/* Rating + Meta - Premium cards */}
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              {/* Main rating card */}
              <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-4">
                <span className="text-4xl font-black text-white text-glow">{game.rating}</span>
                <div className="flex flex-col gap-1">
                  <StarRating rating={game.rating} size="sm" />
                  <span className="text-xs text-gray-500">{game.ratingCount} resenas</span>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {game.releaseDate}
                </div>
                <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl text-gray-400 text-sm">
                  <Monitor className="w-4 h-4 text-gray-500" />
                  {game.platforms}
                </div>
              </div>
            </div>

            {/* Action Buttons - Premium style */}
            <div className="flex flex-wrap gap-3 mt-8">
              {game.trailerUrl && (
                <Button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] h-14 text-base btn-premium group"
                >
                  <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  {showTrailer ? 'Ocultar Trailer' : 'Ver Trailer'}
                </Button>
              )}
              {game.downloadUrl && (
                <a
                  href={game.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-8 py-4 glass-card hover:bg-white/[0.08] rounded-2xl font-semibold transition-all shadow-lg text-white h-14 text-base group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  Descargar
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              <Button
                onClick={handleWriteReview}
                variant="outline"
                className="flex items-center gap-2.5 px-8 py-4 glass-card hover:bg-white/[0.08] rounded-2xl font-semibold transition-all border-0 h-14 text-base"
              >
                <PenLine className="w-5 h-5" />
                Escribir Resena
              </Button>
            </div>

            {/* Description */}
            <div className="mt-8">
              <div className="gradient-line mb-6" />
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-white rounded-full" />
                Descripcion
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">{game.description}</p>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {game.trailerUrl && (
          <div className="mt-12">
            {showTrailer ? (
              <div className="reveal">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  Trailer
                </h3>
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-black">
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
                className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <img
                  src={trailerThumbnail || game.coverUrl || game.imageUrl}
                  alt={`${game.title} Trailer`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300 pulse-ring">
                    <Play className="w-10 h-10 text-black fill-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-5 left-5">
                  <span className="px-4 py-2 glass-dark rounded-xl text-sm font-semibold">
                    Ver Trailer
                  </span>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-14">
          <div className="gradient-line mb-8" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              Resenas ({game.reviews?.length || 0})
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
