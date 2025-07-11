"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  images: string[]
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock_quantity,
  images = []
}: ProductCardProps) {
  console.log('Rendering ProductCard:', { id, name, description, price, stock_quantity, images });
  const safeImages = images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url
    }
    return `http://localhost:8000${url}`
  }

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image: safeImages[0] || ''
    })
  }

  return (
    <>
      <Card className="overflow-hidden bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
        <Link href={`/products/${id}`}>
          <div className="relative aspect-square overflow-hidden bg-slate-900/50">
            {safeImages && safeImages.length > 0 ? (
              <>
                <Image
                  src={getImageUrl(safeImages[currentImageIndex])}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {safeImages.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={e => {
                        e.preventDefault();
                        setCurrentImageIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1))
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {/* Right Arrow */}
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={e => {
                        e.preventDefault();
                        setCurrentImageIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1))
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {safeImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={e => {
                            e.preventDefault();
                            setCurrentImageIndex(index)
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'bg-emerald-500 w-4'
                              : 'bg-slate-400/50 hover:bg-slate-300/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                <ShoppingCart className="w-12 h-12 text-slate-600" />
              </div>
            )}
          </div>
        </Link>
        <CardContent className="p-2 pt-3">
          <Link href={`/products/${id}`} className="block">
            <h3 className="text-base font-semibold text-white mb-1 line-clamp-1 leading-tight">{name}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mb-1 leading-snug">{description}</p>
          </Link>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-emerald-500">${price ? price.toFixed(2) : '0.00'}</span>
            <Button
              onClick={handleAddToCart}
              disabled={stock_quantity === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 text-xs h-7 min-w-0"
            >
              {stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden bg-slate-800 border-slate-700 rounded-lg animate-pulse">
      <div className="relative aspect-square overflow-hidden bg-slate-900/50 flex items-center justify-center">
        <div className="w-full h-full bg-slate-700" />
      </div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-slate-700 mb-2 rounded" />
        <div className="h-4 w-full bg-slate-700 mb-3 rounded" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/4 bg-slate-700 rounded" />
          <div className="h-10 w-1/3 bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;