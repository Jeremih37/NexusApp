'use client'

import { useRouter } from 'next/navigation'
import { LayoutGrid, ChevronRight } from 'lucide-react'
import { useCategories, useGames } from '@/hooks/use-games'

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories()
  const { data: games = [] } = useGames({})
  const router = useRouter()

  if (isLoading) return null

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Categorias</h2>
            <p className="text-gray-500 text-sm mt-0.5">Explora por genero</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-fade">
        {categories.map((cat) => {
          const gameCount = games.filter(g => g.category?.slug === cat.slug).length || cat._count?.games || 0
          return (
            <button
              key={cat.id}
              onClick={() => router.push(`/catalog?category=${cat.slug}`)}
              className="glass-card p-5 rounded-2xl transition-all group card-lift text-center relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)' }}
              />

              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <h3 className="font-bold text-sm group-hover:text-white transition-colors mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500">{gameCount} juegos</p>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
