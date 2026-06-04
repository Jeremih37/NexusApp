'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Gamepad2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameCard } from '@/components/game/game-card'
import { GameCardSkeleton } from '@/components/game/game-card-skeleton'
import { SearchFilters } from '@/components/catalog/search-filters'
import { useGames, useCategories, useFavorites, useToggleFavorite } from '@/hooks/use-games'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSearch = searchParams.get('search') ?? ''
  const initialCategory = searchParams.get('category') ?? 'all'

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('rating')

  const { data: favorites = [] } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const { data: categories = [] } = useCategories()

  const { data: games = [], isLoading } = useGames({
    category: selectedCategory,
    search: debouncedSearch,
    sort: sortBy,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (debouncedSearch) params.set('search', debouncedSearch)
    const queryString = params.toString()
    router.replace(`/catalog${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [selectedCategory, debouncedSearch, router])

  const handleSearch = () => {
    setDebouncedSearch(searchQuery)
  }

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Page title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black">Catalogo</h1>
            </div>
            <p className="text-gray-500 ml-13">Explora nuestra coleccion completa de videojuegos</p>
          </div>

          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-fade">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  variant="catalog"
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={(gameId) => toggleFavorite.mutate(gameId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-xl font-bold text-gray-300 mb-2">No se encontraron juegos</p>
              <p className="text-gray-500">Intenta con otra busqueda o categoria</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
