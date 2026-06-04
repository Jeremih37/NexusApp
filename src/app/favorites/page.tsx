'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameCard } from '@/components/game/game-card'
import { useFavoriteGames, useToggleFavorite } from '@/hooks/use-games'

export default function FavoritesPage() {
  const { data: favoriteGames = [], isLoading } = useFavoriteGames()
  const toggleFavorite = useToggleFavorite()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-red-400 fill-current" />
            Mis Favoritos
          </h2>
          <p className="text-gray-400">{favoriteGames.length} juego{favoriteGames.length !== 1 ? 's' : ''} en tu lista</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900/40 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                <div className="aspect-[16/10] bg-gray-700/50" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-3 bg-gray-700/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                variant="favorite"
                isFavorite={true}
                onToggleFavorite={(gameId) => toggleFavorite.mutate(gameId)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Aún no tienes favoritos</p>
            <p className="text-sm mt-1">Explora el catálogo y guarda tus juegos preferidos</p>
            <Link href="/catalog">
              <Button className="mt-4 bg-amber-700 hover:bg-amber-600">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
