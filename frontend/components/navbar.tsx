"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/context/cart-context'

export default function Navbar() {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-white">Easy Buy</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" className="text-white hover:text-emerald-400">
                Products
              </Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost" className="text-white hover:text-emerald-400">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-emerald-400">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
