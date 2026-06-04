'use client'

import { MessageCircle } from 'lucide-react'
import { StarRating } from './star-rating'
import type { Review } from '@/types'

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-400 font-medium">No hay resenas aun.</p>
        <p className="text-gray-500 text-sm mt-1">Se el primero en compartir tu opinion!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 stagger-fade">
      {reviews.map((review) => (
        <div key={review.id} className="glass-card rounded-2xl p-6 group hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-sm font-bold text-black shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                {review.user.avatar}
              </div>
              <div>
                <p className="font-semibold">{review.user.name}</p>
                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm font-bold text-white glass-card px-2.5 py-1 rounded-lg">{review.rating}.0</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
