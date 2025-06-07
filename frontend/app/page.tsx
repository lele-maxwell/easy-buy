import { Suspense } from 'react'
import { AnimatedSection } from '@/components/animated-section'
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import CategoryBrowse from "@/components/category-browse"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <AnimatedSection 
        className="relative py-20 overflow-hidden"
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
        </div>
      </AnimatedSection>

      {/* Featured Products Section */}
      <AnimatedSection 
        className="py-16 bg-slate-900"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-slate-400">Discover our most popular items</p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-800 rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
        </div>
      </AnimatedSection>

      {/* Categories Section */}
      <AnimatedSection 
        className="py-16 bg-slate-900/50"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Browse Categories</h2>
            <p className="text-slate-400">Find what you're looking for</p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-800 rounded-lg h-32"></div>
                </div>
              ))}
            </div>
          }>
            <CategoryBrowse />
          </Suspense>
        </div>
      </AnimatedSection>
    </main>
  )
}
