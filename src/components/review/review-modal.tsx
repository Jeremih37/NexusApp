'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { StarRatingInput } from './star-rating-input'
import { useCreateReview, useCurrentUser } from '@/hooks/use-games'

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameId: string
  gameTitle: string
}

export function ReviewModal({ open, onOpenChange, gameId, gameTitle }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { data: user } = useCurrentUser()
  const createReview = useCreateReview()

  const handleSubmit = () => {
    if (!comment.trim() || !user) return
    createReview.mutate(
      { userId: user.id, gameId, rating, comment },
      {
        onSuccess: () => {
          setRating(5)
          setComment('')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Escribir Reseña</DialogTitle>
          <DialogDescription className="text-gray-400">{gameTitle}</DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tu Calificación</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tu Reseña</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este juego..."
            rows={4}
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 resize-none"
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!comment.trim() || createReview.isPending}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500"
          >
            Publicar Reseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
