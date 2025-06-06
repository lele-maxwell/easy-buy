'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

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
    <div className="relative overflow-hidden">
      <div className="glass mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome to Easy Buy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Your one-stop shop for all your needs. Browse our wide selection of products and find the perfect items for you.
          </p>
          <div className="mt-10">
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
      </div>
    </div>
  )
}
