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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
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
  )
}
