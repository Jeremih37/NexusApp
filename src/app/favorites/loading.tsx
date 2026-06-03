import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <div className="h-8 bg-gray-700/50 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
              <div className="aspect-[16/10] bg-gray-700/50" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-700/50 rounded w-3/4" />
                <div className="h-3 bg-gray-700/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
