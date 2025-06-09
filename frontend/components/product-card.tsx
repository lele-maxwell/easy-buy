"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCart } from '@/context/cart-context'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  created_at: string | null
  updated_at: string | null
  image_url?: string | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-slate-700/50 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-slate-700/50 rounded w-1/2 animate-pulse" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-8 bg-slate-700/50 rounded w-full animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-700/50 hover:border-primary/50 bg-slate-800/50">
        <Link href={`/products/${product.id}`}>
          <motion.div 
            className="aspect-square bg-slate-700/50 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                No Image
              </div>
            )}
          </motion.div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
          <p className="text-sm text-slate-500">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                addToCart(product)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25c0.966 0 1.897.187 2.786.53V16.5h-5.37c-1.087 0-2.018.187-2.907.531V14.25z" />
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}