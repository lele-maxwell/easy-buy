import { Suspense } from 'react'
import { AnimatedSection } from '@/components/animated-section'
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import CategoryBrowse from "@/components/category-browse"
import { Star } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const testimonials = [
  {
    name: 'Jane Doe',
    avatar: '/avatars/avatar1.png',
    rating: 5,
    text: 'Easy Buy made my shopping experience so smooth! Fast delivery and great support.'
  },
  {
    name: 'John Smith',
    avatar: '/avatars/avatar2.png',
    rating: 4,
    text: 'Great selection and the checkout process was a breeze. Highly recommend!'
  },
  {
    name: 'Amina Yusuf',
    avatar: '/avatars/avatar3.png',
    rating: 5,
    text: 'I love the deals and the customer service is top-notch.'
  },
]

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

      {/* Testimonials Section */}
      <AnimatedSection 
        className="py-16 bg-deepnavy/80"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cream mb-4">What Our Customers Say</h2>
            <p className="text-cream/80">Real experiences from real shoppers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-softblack/90 border border-gold/20 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-emerald shadow" />
                <div className="flex items-center justify-center mb-2">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                  {[...Array(5 - t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 text-gold/30" />
                  ))}
                </div>
                <p className="text-cream text-lg mb-3">“{t.text}”</p>
                <span className="text-emerald font-bold">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Promotions Section */}
      <AnimatedSection 
        className="py-8 bg-gradient-to-r from-emerald/80 via-gold/30 to-emerald/80"
        variants={fadeInUp}
      >
        <div className="max-w-2xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-softblack/90 border border-gold/30 shadow-lg p-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gold mb-2">10% Off Your First Order!</h3>
            <p className="text-cream/90">Sign up today and enjoy an exclusive discount on your first purchase. Don’t miss out!</p>
          </div>
          {/* Assuming Button component is available, otherwise this will cause an error */}
          {/* <Button className="bg-gold hover:bg-emerald text-softblack font-bold px-8 py-3 rounded-full shadow-lg mt-4 md:mt-0">
            Get Started
          </Button> */}
        </div>
      </AnimatedSection>
    </main>
  )
}
