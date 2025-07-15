'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import Image from 'next/image'

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
    <div className="relative flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-xl shadow-lg h-[320px] md:h-[400px] lg:h-[480px] bg-slate-900">
      {/* Left: Text Content */}
      <div className="flex-1 flex flex-col items-center md:items-start justify-center px-6 py-10 z-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
          Welcome to Easy Buy
        </h1>
        <p className="text-base md:text-lg mb-6 text-slate-200 drop-shadow">
          Your one-stop shop for all your needs. Browse our wide selection of products and find the perfect items for you.
        </p>
        <Button 
          onClick={handleShopNow}
          className="bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {loading ? 'Loading...' : user ? 'Shop Now' : 'Get Started'}
        </Button>
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
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent md:rounded-r-xl" />
      </div>
    </div>
  )
}
