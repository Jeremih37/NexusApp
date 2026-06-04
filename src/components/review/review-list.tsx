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
      <div className="text-center py-12 text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay reseñas aún. ¡Sé el primero en compartir tu opinión!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-900/50 rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-sm font-bold text-black">
                {review.user.avatar}
              </div>
              <div>
                <p className="font-medium">{review.user.name}</p>
                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm font-medium text-gray-300">{review.rating}.0</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
