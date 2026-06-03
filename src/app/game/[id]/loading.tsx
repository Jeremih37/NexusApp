import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function GameLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-gray-800 rounded w-40" />
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-64 h-80 bg-gray-800 rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-800 rounded w-24" />
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-10 bg-gray-800 rounded w-32 mt-4" />
                <div className="h-10 bg-gray-800 rounded w-28" />
                <div className="h-4 bg-gray-800 rounded w-full mt-4" />
                <div className="h-4 bg-gray-800 rounded w-5/6" />
                <div className="h-4 bg-gray-800 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
