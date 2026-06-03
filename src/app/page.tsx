'use client'

import { useEffect, useState } from 'react'

export interface Game {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string
  coverUrl?: string | null
  trailerUrl?: string | null
  downloadUrl?: string | null
  developer: string
  publisher: string
  releaseDate: string
  rating: number
  ratingCount: number
  categoryId: string
  category: Category
  platforms: string
  featured: boolean
  createdAt: string
  reviews: Review[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
  _count?: { games: number }
}

export interface Review {
  id: string
  userId: string
  gameId: string
  rating: number
  comment: string
  createdAt: string
  user: { id: string; name: string; avatar: string }
}

export interface Favorite {
  id: string
  userId: string
  gameId: string
  game: Game
}

const CURRENT_USER_EMAIL = 'carlos@nexusapp.com'

export default function NexusApp() {
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [favorites, setFavorites] = useState<string[]>([])
  const [view, setView] = useState<'home' | 'catalog' | 'favorites'>('home')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Get current user
        const userRes = await fetch(`/api/users?email=${CURRENT_USER_EMAIL}`)
        const userData = await userRes.json()
        const userId = userData.id
        setCurrentUserId(userId)

        const [gamesRes, catRes, favRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/categories'),
          fetch(`/api/favorites?userId=${userId}`),
        ])
        const gamesData = await gamesRes.json()
        const catData = await catRes.json()
        const favData = await favRes.json()
        setGames(gamesData)
        setCategories(catData)
        setFavorites(favData.map((f: Favorite) => f.gameId))
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const fetchGames = async (category: string, search: string, sort: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.set('category', category)
      if (search) params.set('search', search)
      params.set('sort', sort)
      const res = await fetch(`/api/games?${params}`)
      const data = await res.json()
      setGames(data)
    } catch (err) {
      console.error('Error fetching games:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames(selectedCategory, searchQuery, sortBy)
  }, [selectedCategory, sortBy])

  const handleSearch = () => {
    fetchGames(selectedCategory, searchQuery, sortBy)
  }

  const toggleFavorite = async (gameId: string) => {
    if (!currentUserId) return
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, gameId }),
      })
      const data = await res.json()
      if (data.added) {
        setFavorites(prev => [...prev, gameId])
      } else if (data.removed) {
        setFavorites(prev => prev.filter(id => id !== gameId))
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const submitReview = async () => {
    if (!selectedGame || !newReview.comment.trim() || !currentUserId) return
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          gameId: selectedGame.id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })
      // Refresh game data
      const res = await fetch(`/api/games/${selectedGame.id}`)
      const updated = await res.json()
      setSelectedGame(updated)
      setNewReview({ rating: 5, comment: '' })
      setShowReviewModal(false)
      // Refresh games list
      fetchGames(selectedCategory, searchQuery, sortBy)
    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  const featuredGames = games.filter(g => g.featured)
  const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const favoriteGames = games.filter(g => favorites.includes(g.id))

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <svg key={star} className={`${sizeClass} ${star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600 fill-gray-600'}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    )
  }

  const StarRatingInput = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <svg className={`w-7 h-7 ${star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600 fill-gray-600'} transition-colors`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Game Detail Header */}
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={selectedGame.coverUrl || selectedGame.imageUrl}
              alt={selectedGame.title}
              className="w-full h-full object-cover opacity-20 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/80 to-gray-950" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
            {/* Back button */}
            <button
              onClick={() => { setSelectedGame(null); setShowTrailer(false) }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver al catálogo</span>
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Game Image */}
              <div className="flex-shrink-0">
                <img
                  src={selectedGame.imageUrl}
                  alt={selectedGame.title}
                  className="w-64 h-80 object-cover rounded-xl shadow-2xl shadow-purple-500/10 border border-gray-700/50"
                />
              </div>

              {/* Game Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-3 border border-purple-500/30">
                      {selectedGame.category.name}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedGame.title}</h1>
                    <p className="text-gray-400 text-lg">{selectedGame.developer} &middot; {selectedGame.publisher}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedGame.id)}
                    className={`p-3 rounded-full transition-all ${favorites.includes(selectedGame.id) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-400 hover:text-red-400 border border-gray-700'}`}
                  >
                    <svg className="w-6 h-6" fill={favorites.includes(selectedGame.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
                    <span className="text-3xl font-bold text-amber-400">{selectedGame.rating}</span>
                    <div className="flex flex-col">
                      {renderStars(selectedGame.rating, 'sm')}
                      <span className="text-xs text-gray-500 mt-0.5">{selectedGame.ratingCount} reseñas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedGame.releaseDate}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedGame.platforms}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {selectedGame.trailerUrl && (
                    <button
                      onClick={() => setShowTrailer(!showTrailer)}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Ver Trailer
                    </button>
                  )}
                  {selectedGame.downloadUrl && (
                    <a
                      href={selectedGame.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </a>
                  )}
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors border border-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Escribir Reseña
                  </button>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedGame.description}</p>
                </div>
              </div>
            </div>

            {/* Trailer */}
            {showTrailer && selectedGame.trailerUrl && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Trailer
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
                  <iframe
                    src={selectedGame.trailerUrl}
                    title={`${selectedGame.title} Trailer`}
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
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Reseñas ({selectedGame.reviews?.length || 0})
                </h3>
              </div>

              {selectedGame.reviews && selectedGame.reviews.length > 0 ? (
                <div className="space-y-4">
                  {selectedGame.reviews.map(review => (
                    <div key={review.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                            {review.user.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{review.user.name}</p>
                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating, 'sm')}
                          <span className="text-sm font-medium text-amber-400">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No hay reseñas aún. ¡Sé el primero en compartir tu opinión!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowReviewModal(false)}>
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Escribir Reseña</h3>
              <p className="text-gray-400 mb-4">{selectedGame.title}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tu Calificación</label>
                <StarRatingInput />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Tu Reseña</label>
                <textarea
                  value={newReview.comment}
                  onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este juego..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitReview}
                  disabled={!newReview.comment.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
                >
                  Publicar Reseña
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/20">
                N
              </div>
              <span className="text-xl font-bold tracking-tight">Nexus<span className="text-purple-400">App</span></span>
            </div>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { key: 'home', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { key: 'catalog', label: 'Catálogo', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { key: 'favorites', label: 'Favoritos', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === item.key ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                CG
              </div>
              <span className="text-sm font-medium text-gray-300 hidden lg:inline">Carlos García</span>
            </div>

            {/* Mobile Nav + User */}
            <div className="flex sm:hidden items-center gap-2">
              {[
                { key: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { key: 'catalog', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { key: 'favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key as any)}
                  className={`p-2 rounded-lg transition-all ${view === item.key ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </button>
              ))}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                CG
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HOME VIEW */}
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="mb-12">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 via-gray-900 to-pink-900/50 p-8 md:p-12 border border-purple-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Descubre tu próximo <br />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">juego favorito</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-xl">
                    Explora reseñas, calificaciones, trailers y enlaces de descarga de los mejores videojuegos. Todo en un solo lugar.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                    <div className="flex-1 relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Buscar videojuegos..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Games Carousel */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Juegos Destacados
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGames.slice(0, 6).map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-sm font-medium">{game.rating}</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-xs font-medium">
                          {game.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">{game.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{game.developer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {game.platforms}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); toggleFavorite(game.id) }}
                          className={`p-1.5 rounded-full transition-all ${favorites.includes(game.id) ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                        >
                          <svg className="w-4 h-4" fill={favorites.includes(game.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Rated */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Mejor Calificados
                </h2>
                <button onClick={() => setView('catalog')} className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  Ver todos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRated.map((game, idx) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
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
                        {renderStars(game.rating, 'sm')}
                        <span className="text-xs text-amber-400 font-medium">{game.rating}</span>
                      </div>
                      <span className="text-xs text-gray-600">{game.category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Your Favorites */}
            {favoriteGames.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Tus Favoritos
                  </h2>
                  <button onClick={() => setView('favorites')} className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
                    Ver todos
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {favoriteGames.map(game => (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="flex-shrink-0 w-44 cursor-pointer group"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all mb-2">
                        <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-xs font-medium">{game.rating}</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium truncate group-hover:text-red-300 transition-colors">{game.title}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Categories Quick Access */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Categorías
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setView('catalog') }}
                    className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all group text-left"
                  >
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <h3 className="font-semibold group-hover:text-cyan-300 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat._count?.games || 0} juegos</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CATALOG VIEW */}
        {view === 'catalog' && (
          <>
            {/* Search & Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Buscar videojuegos..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="rating">Mejor calificados</option>
                  <option value="newest">Más recientes</option>
                  <option value="name">A-Z</option>
                </select>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-gray-800/60 text-gray-400 hover:text-white border border-gray-700'}`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedCategory === cat.slug ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-gray-800/60 text-gray-400 hover:text-white border border-gray-700'}`}
                  >
                    <span className="text-xs">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Games Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                    <div className="aspect-[16/10] bg-gray-700/50" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-700/50 rounded w-3/4" />
                      <div className="h-3 bg-gray-700/50 rounded w-1/2" />
                      <div className="h-3 bg-gray-700/50 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
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
                        <span className="text-xs text-purple-400 font-medium">{game.category.name}</span>
                        <span className="text-gray-700">&middot;</span>
                        <span className="text-xs text-gray-500">{game.releaseDate}</span>
                      </div>
                      <h3 className="font-bold mb-1 group-hover:text-purple-300 transition-colors truncate">{game.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{game.developer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {renderStars(game.rating, 'sm')}
                          <span className="text-xs text-gray-500 ml-1">({game.ratingCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {game.trailerUrl && (
                            <span className="p-1.5 text-gray-500 hover:text-purple-400 transition-colors" title="Trailer disponible">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </span>
                          )}
                          {game.downloadUrl && (
                            <span className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors" title="Descarga disponible">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </span>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); toggleFavorite(game.id) }}
                            className={`p-1.5 rounded-full transition-all ${favorites.includes(game.id) ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                          >
                            <svg className="w-4 h-4" fill={favorites.includes(game.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg">No se encontraron juegos</p>
                <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
              </div>
            )}
          </>
        )}

        {/* FAVORITES VIEW */}
        {view === 'favorites' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Mis Favoritos
              </h2>
              <p className="text-gray-400">{favoriteGames.length} juego{favoriteGames.length !== 1 ? 's' : ''} en tu lista</p>
            </div>

            {favoriteGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer bg-gray-800/40 rounded-xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-sm font-medium">{game.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1 group-hover:text-red-300 transition-colors truncate">{game.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{game.developer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-400">{game.category.name}</span>
                        <button
                          onClick={e => { e.stopPropagation(); toggleFavorite(game.id) }}
                          className="p-1.5 rounded-full text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-lg">Aún no tienes favoritos</p>
                <p className="text-sm mt-1">Explora el catálogo y guarda tus juegos preferidos</p>
                <button
                  onClick={() => setView('catalog')}
                  className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-xs">
                N
              </div>
              <span className="font-bold">Nexus<span className="text-purple-400">App</span></span>
            </div>
            <p className="text-gray-500 text-sm">Tu plataforma para descubrir, evaluar y descargar videojuegos</p>
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-sm">2025 NexusApp</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
