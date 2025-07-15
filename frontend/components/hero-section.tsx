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
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
      <Image
        src="/shop.webp"
        alt="Shop Hero"
        layout="fill"
        objectFit="cover"
        priority
        className="z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
      <div className="relative z-20 text-center text-white px-4 w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to Easy Buy
        </h1>
        <p className="text-lg md:text-2xl mb-6 drop-shadow">
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
    </div>
  )
}
