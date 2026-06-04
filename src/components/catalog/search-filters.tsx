'use client'

import { Search } from 'lucide-react'
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
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Buscar videojuegos..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-white/30 h-12"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="px-4 py-3 bg-white/5 border-white/10 rounded-xl text-white focus:ring-white/30 w-[200px] h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="rating">Mejor calificados</SelectItem>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="name">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedCategory === 'all'
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
              selectedCategory === cat.slug
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
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
