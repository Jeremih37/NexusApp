'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Update URL when category changes
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-20 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No se encontraron juegos</p>
            <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
