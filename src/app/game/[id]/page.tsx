'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameDetail } from '@/components/game/game-detail'

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <GameDetail id={id} />
      </main>
      <Footer />
    </div>
  )
}
