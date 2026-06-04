'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GameDetail } from '@/components/game/game-detail'

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <GameDetail id={id} />
        </main>
        <Footer />
      </div>
    </div>
  )
}
