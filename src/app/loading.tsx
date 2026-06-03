import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Hero skeleton */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 p-8 md:p-12 border border-gray-700/50 animate-pulse">
            <div className="h-12 bg-gray-700/50 rounded w-3/4 mb-4" />
            <div className="h-12 bg-gray-700/50 rounded w-1/2 mb-8" />
            <div className="h-4 bg-gray-700/50 rounded w-full mb-2" />
            <div className="h-4 bg-gray-700/50 rounded w-2/3 mb-8" />
            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 h-12 bg-gray-700/50 rounded-xl" />
              <div className="w-24 h-12 bg-gray-700/50 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Featured skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-gray-700/50 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
                <div className="aspect-[16/10] bg-gray-700/50 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-700/50 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-700/50 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
