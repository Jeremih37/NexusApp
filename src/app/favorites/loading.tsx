import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameCardSkeleton } from '@/components/game/game-card-skeleton'

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="mb-10">
            <div className="h-8 bg-white/[0.03] rounded-xl w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-white/[0.03] rounded-xl w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
