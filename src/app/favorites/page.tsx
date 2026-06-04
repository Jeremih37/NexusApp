'use client'

import { Heart, Gamepad2 } from 'lucide-react'
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black">Mis Favoritos</h1>
                <p className="text-gray-500 mt-0.5">{favoriteGames.length} juego{favoriteGames.length !== 1 ? 's' : ''} en tu lista</p>
              </div>
            </div>
            <div className="gradient-line mt-6" />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-white/[0.03]" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/[0.03] rounded w-3/4" />
                    <div className="h-3 bg-white/[0.03] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : favoriteGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-fade">
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
            <div className="text-center py-24">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-xl font-bold text-gray-300 mb-2">Aun no tienes favoritos</p>
              <p className="text-gray-500 mb-6">Explora el catalogo y guarda tus juegos preferidos</p>
              <Link href="/catalog">
                <Button className="bg-white hover:bg-gray-100 text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-xl btn-premium">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Explorar Catalogo
                </Button>
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
