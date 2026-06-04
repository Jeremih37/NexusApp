'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/game/hero-section'
import { FeaturedSection } from '@/components/game/featured-section'
import { TopRatedSection } from '@/components/game/top-rated-section'
import { FavoritesPreview } from '@/components/game/favorites-preview'
import { CategoriesSection } from '@/components/game/categories-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gray-500/[0.01] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <HeroSection />
          <FeaturedSection />
          <TopRatedSection />
          <FavoritesPreview />
          <CategoriesSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
