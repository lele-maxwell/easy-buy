"use client"

import { useState, useEffect } from 'react'
import { motion, type Variants } from '@/components/motion'
import ProductCard, { ProductCardSkeleton } from '@/components/product-card'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  created_at: string | null
  updated_at: string | null
}

// Mock data for featured products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    stock_quantity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    description: 'Latest smartwatch with health monitoring features',
    price: 299.99,
    stock_quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ultra HD 4K Monitor',
    description: '32-inch 4K monitor with HDR support',
    price: 499.99,
    stock_quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with customizable keys',
    price: 129.99,
    stock_quantity: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with RGB lighting',
    price: 79.99,
    stock_quantity: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with USB-C interface',
    price: 149.99,
    stock_quantity: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    description: 'Waterproof portable Bluetooth speaker with 20-hour battery life',
    price: 89.99,
    stock_quantity: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi devices',
    price: 39.99,
    stock_quantity: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
        console.log('Fetching products...')
        
        // Add headers to ensure proper content type
        const response = await api.get('/api/product', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Products response:', response.data)
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format')
        }
        
        setProducts(response.data.slice(0, 8)) // Get first 8 products
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching products:', err)
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: err.config
        })
        
        // Use mock data when API call fails
        console.log('Using mock data due to API error')
        setProducts(mockProducts)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} variants={item}>
            <ProductCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-slate-400 mt-2">Please try refreshing the page</p>
      </motion.div>
    )
  }

  if (products.length === 0) {
    // Use mock data when no products are available
    setProducts(mockProducts)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
