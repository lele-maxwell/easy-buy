"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  return (
    <div className="group bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock Badge */}
        {product.stock_quantity < 10 && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Only {product.stock_quantity} left</Badge>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">{product.description || 'No description available'}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-400">${product.price.toFixed(2)}</span>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <Skeleton className="aspect-square bg-slate-700" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20 bg-slate-700" />
        <Skeleton className="h-5 w-full bg-slate-700" />
        <Skeleton className="h-4 w-3/4 bg-slate-700" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16 bg-slate-700" />
          <Skeleton className="h-8 w-24 bg-slate-700" />
        </div>
      </div>
    </div>
  )
}
