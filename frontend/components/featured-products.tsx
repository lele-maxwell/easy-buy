'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // For now, using mock data. Replace with actual API call later
    const mockProducts = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        description: "Premium quality sound with noise cancellation",
        price: 129.99,
        image: "/placeholder.svg?height=300&width=300"
      },
      {
        id: "2",
        name: "Smart Home Security Camera",
        description: "HD video monitoring with mobile app",
        price: 89.99,
        image: "/placeholder.svg?height=300&width=300"
      },
      {
        id: "3",
        name: "Yoga Mat Premium",
        description: "Non-slip exercise mat for all fitness levels",
        price: 39.99,
        image: "/placeholder.svg?height=300&width=300"
      },
      {
        id: "4",
        name: "LED Desk Lamp",
        description: "Adjustable brightness with USB charging",
        price: 49.99,
        image: "/placeholder.svg?height=300&width=300"
      }
    ]
    setProducts(mockProducts)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="glass rounded-lg p-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="mt-2 text-sm text-gray-400">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
