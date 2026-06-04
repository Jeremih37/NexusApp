'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Gamepad2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/catalog')
    }
  }

  return (
    <section className="mb-16">
      <div className="relative overflow-hidden rounded-2xl bg-black p-8 md:p-14 border border-white/10 pattern-grid">
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 glow-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-500/[0.04] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 glow-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[120px]" />

        {/* Decorative elements */}
        <div className="absolute top-8 right-8 animate-float">
          <Gamepad2 className="w-12 h-12 text-white/10" />
        </div>
        <div className="absolute bottom-10 right-24 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-8 h-8 text-white/8" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6 text-sm text-gray-400">
            <Sparkles className="w-3.5 h-3.5" />
            Tu plataforma de videojuegos
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 tracking-tight leading-[1.1]">
            Descubre tu próximo{' '}
            <span className="shimmer-white">juego favorito</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            Explora reseñas, calificaciones, trailers y enlaces de descarga de los mejores videojuegos. Todo en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar videojuegos..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-white/30 focus:border-white/20 h-14 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="px-8 py-3 bg-white hover:bg-gray-200 text-black rounded-xl font-semibold transition-all shadow-lg shadow-white/10 h-14 text-base"
            >
              Buscar
            </Button>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/5">
            <div>
              <span className="text-2xl md:text-3xl font-black text-white">500+</span>
              <p className="text-gray-500 text-sm mt-1">Juegos</p>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-white">10K+</span>
              <p className="text-gray-500 text-sm mt-1">Reseñas</p>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-white">50+</span>
              <p className="text-gray-500 text-sm mt-1">Categorías</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
