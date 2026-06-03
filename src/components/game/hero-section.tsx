'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
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
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 via-gray-900 to-pink-900/50 p-8 md:p-12 border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre tu próximo <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">juego favorito</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Explora reseñas, calificaciones, trailers y enlaces de descarga de los mejores videojuegos. Todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar videojuegos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-purple-500 focus:border-transparent h-12"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20 h-12"
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
