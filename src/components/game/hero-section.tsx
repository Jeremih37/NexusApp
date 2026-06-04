'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Gamepad2, Sparkles, ChevronRight, Zap, Trophy, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count}{suffix}</span>
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/catalog')
    }
  }

  return (
    <section className="mb-20">
      <div className="relative overflow-hidden rounded-3xl min-h-[520px] md:min-h-[580px] bg-black border border-white/[0.06] noise-overlay">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />

        {/* Large ambient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-white/[0.04] rounded-full blur-[150px] glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gray-400/[0.03] rounded-full blur-[120px] glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]" />

        {/* Decorative orbiting elements */}
        <div className="absolute top-20 right-20 animate-float-dramatic opacity-20">
          <Gamepad2 className="w-16 h-16 text-white" />
        </div>
        <div className="absolute bottom-24 right-40 animate-float opacity-15" style={{ animationDelay: '3s' }}>
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="absolute top-32 left-[60%] animate-float opacity-10" style={{ animationDelay: '1s' }}>
          <Zap className="w-8 h-8 text-white" />
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none" />

        {/* Gradient bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[2]" />

        {/* Main content */}
        <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col justify-center min-h-[520px] md:min-h-[580px]">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full mb-8 badge-glow">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm text-gray-300 font-medium tracking-wide">Tu plataforma de videojuegos</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.05]">
              Descubre tu{' '}
              <br className="hidden md:block" />
              próximo{' '}
              <span className="shimmer-premium">juego favorito</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Explora reseñas, calificaciones, trailers y enlaces de descarga de los mejores videojuegos.
              <span className="text-white font-medium"> Todo en un solo lugar.</span>
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar videojuegos..."
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:ring-white/20 focus:border-white/20 h-14 text-base backdrop-blur-sm transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] h-14 text-base btn-premium group"
              >
                Buscar
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/catalog?category=action" className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-full transition-all">
                Accion
              </Link>
              <Link href="/catalog?category=rpg" className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-full transition-all">
                RPG
              </Link>
              <Link href="/catalog?category=adventure" className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-full transition-all">
                Aventura
              </Link>
              <Link href="/catalog" className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-full transition-all">
                Ver todo
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className={`relative z-10 mx-8 md:mx-14 lg:mx-16 mb-8 md:mb-14 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-dark rounded-2xl p-6 md:p-8">
            <div className="gradient-line mb-6" />
            <div className="flex flex-wrap gap-10 md:gap-16">
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors">
                    <Gamepad2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-3xl md:text-4xl font-black text-white text-glow">
                    {isVisible ? <AnimatedCounter target={500} suffix="+" /> : '0'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm ml-11">Juegos</p>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors">
                    <Trophy className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-3xl md:text-4xl font-black text-white text-glow">
                    {isVisible ? <AnimatedCounter target={10} suffix="K+" /> : '0'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm ml-11">Resenas</p>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-3xl md:text-4xl font-black text-white text-glow">
                    {isVisible ? <AnimatedCounter target={50} suffix="+" /> : '0'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm ml-11">Categorias</p>
              </div>
            </div>
            <div className="gradient-line mt-6" />
          </div>
        </div>
      </div>
    </section>
  )
}
