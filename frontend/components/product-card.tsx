"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
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
  images
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url
    }
    return `http://localhost:8000${url}`
  }

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      image: images[0] || ''
    })
  }

  return (
    <Card className="overflow-hidden bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-900/50">
          {images && images.length > 0 ? (
            <>
              <Image
                src={getImageUrl(images[currentImageIndex])}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
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
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
              <ShoppingCart className="w-12 h-12 text-slate-600" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${id}`} className="block">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{name}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{description}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-500">${price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            disabled={stock_quantity === 0}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}