import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameCardSkeleton } from '@/components/game/game-card-skeleton'

export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 h-12 bg-gray-700/50 rounded-xl animate-pulse" />
            <div className="w-[200px] h-12 bg-gray-700/50 rounded-xl animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-20 bg-gray-700/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
