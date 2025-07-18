'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleShopNow = () => {
    if (!user) {
      router.push('/auth/register')
    } else {
      router.push('/products')
    }
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-xl shadow-lg h-[320px] md:h-[400px] lg:h-[480px] bg-softblack">
      {/* Left: Text Content */}
      <div className="flex-1 flex flex-col items-center md:items-start justify-center px-6 py-10 z-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-cream drop-shadow-lg text-center leading-tight relative"
        >
          <span className="italic font-serif tracking-wide">
            Welcome to{' '}
            <span className="text-emerald italic bg-gradient-to-r from-emerald to-gold bg-clip-text text-transparent">
              Easy Buy
            </span>
          </span>
        </motion.h1>
        <p className="text-base md:text-lg mb-6 text-cream/80 drop-shadow">
          Your one-stop shop for all your needs. Browse our wide selection of products and find the perfect items for you.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center w-full mt-16"
        >
          <Button 
            onClick={handleShopNow}
            className="bg-emerald hover:bg-gold text-softblack font-bold shadow-lg border border-gold/40 px-8 py-3 rounded-full text-lg"
            disabled={loading}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {loading ? 'Loading...' : user ? 'Shop Now' : 'Get Started'}
          </Button>
        </motion.div>
      </div>
      {/* Right: Image */}
      <div className="relative w-full md:w-3/5 h-48 md:h-full">
        <Image
          src="/shop.webp"
          alt="Shop Hero"
          fill
          className="object-cover object-top rounded-none md:rounded-r-xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-deepnavy/80 via-black/40 to-transparent md:rounded-r-xl border-l-4 border-gold/30" />
      </div>
    </div>
  )
}
