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
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              No Image
            </div>
          </motion.div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/products/${product.id}`}>
            <motion.h3 
              className="text-lg font-semibold mb-2 hover:text-primary transition-colors"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {product.name}
            </motion.h3>
          </Link>
          <p className="text-sm text-slate-400 line-clamp-2">
            {product.description || 'No description available'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex items-center justify-between">
            <motion.span 
              className="text-lg font-bold text-emerald-400"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ${product.price.toFixed(2)}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="bg-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
              >
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
