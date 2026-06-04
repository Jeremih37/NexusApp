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
import { useCreateReview } from '@/hooks/use-games'
import { useAuth } from '@/lib/auth-context'

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameId: string
  gameTitle: string
}

export function ReviewModal({ open, onOpenChange, gameId, gameTitle }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { user } = useAuth()
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
      <DialogContent className="bg-black/95 backdrop-blur-2xl border-white/10 text-white sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Escribir Resena</DialogTitle>
          <DialogDescription className="text-gray-400">{gameTitle}</DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-3 text-gray-300">Tu Calificacion</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-3 text-gray-300">Tu Resena</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este juego..."
            rows={4}
            className="w-full bg-white/[0.04] border-white/[0.08] text-white placeholder-gray-500 focus:ring-white/20 focus:border-white/15 resize-none rounded-xl"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!comment.trim() || createReview.isPending}
            className="bg-white hover:bg-gray-100 text-black font-bold disabled:bg-gray-700 disabled:text-gray-500 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Publicar Resena
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
