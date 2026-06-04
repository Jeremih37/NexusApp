'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  sortBy: string
  onSortChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Category[]
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  onSearch,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Buscar videojuegos..."
            className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:ring-white/20 focus:border-white/15 h-12 backdrop-blur-sm transition-all"
          />
        </div>
        <div className="relative">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="px-5 py-3 bg-white/[0.04] border-white/[0.08] rounded-2xl text-white focus:ring-white/20 w-[220px] h-12 backdrop-blur-sm transition-all">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl">
              <SelectItem value="rating">Mejor calificados</SelectItem>
              <SelectItem value="newest">Mas recientes</SelectItem>
              <SelectItem value="name">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
            selectedCategory === 'all'
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]'
              : 'glass-card text-gray-400 hover:text-white hover:bg-white/[0.06]'
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2',
              selectedCategory === cat.slug
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                : 'glass-card text-gray-400 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            <span className="text-xs">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
