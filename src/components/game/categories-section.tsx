'use client'

import { useRouter } from 'next/navigation'
import { LayoutGrid } from 'lucide-react'
import { useCategories } from '@/hooks/use-games'

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories()
  const router = useRouter()

  if (isLoading) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutGrid className="w-6 h-6 text-gray-300" />
        Categorías
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/catalog?category=${cat.slug}`)}
            className="p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/15 transition-all group text-left"
          >
            <span className="text-2xl mb-2 block">{cat.icon}</span>
            <h3 className="font-semibold group-hover:text-gray-200 transition-colors">{cat.name}</h3>
            <p className="text-xs text-gray-500">{cat._count?.games || 0} juegos</p>
          </button>
        ))}
      </div>
    </section>
  )
}
