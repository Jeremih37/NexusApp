'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              'w-7 h-7 transition-colors',
              star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-600 fill-gray-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}
