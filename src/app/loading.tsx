import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Hero skeleton */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-14 animate-pulse min-h-[520px]">
              <div className="h-14 bg-white/[0.03] rounded-2xl w-3/4 mb-4" />
              <div className="h-14 bg-white/[0.03] rounded-2xl w-1/2 mb-8" />
              <div className="h-4 bg-white/[0.03] rounded-xl w-full mb-2" />
              <div className="h-4 bg-white/[0.03] rounded-xl w-2/3 mb-8" />
              <div className="flex gap-3 max-w-xl">
                <div className="flex-1 h-14 bg-white/[0.03] rounded-2xl" />
                <div className="w-28 h-14 bg-white/[0.03] rounded-2xl" />
              </div>
            </div>
          </div>
          {/* Featured skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-white/[0.03] rounded-xl w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <div className="aspect-[16/10] bg-white/[0.03] animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/[0.03] rounded-xl w-3/4 animate-pulse" />
                    <div className="h-3 bg-white/[0.03] rounded-xl w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
