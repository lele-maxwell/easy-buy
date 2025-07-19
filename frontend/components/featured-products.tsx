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
  images?: string[] | null
}

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
        const response = await api.get('/api/products', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Products response:', response.data)
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format')
        }
        
        let sorted = response.data
        if (Array.isArray(sorted)) {
          sorted = sorted
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .filter(product => Array.isArray(product.images) && product.images.length > 0); // Only products with images
        }
        setProducts(sorted.slice(0, 6)) // Get 6 most recent with images
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
        setError('Failed to load products. Please try again later.')
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
        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
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

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">No products found.</p>
        <p className="text-sm text-slate-400 mt-2">Please check back later.</p>
      </div>
    )
  }

  // Before rendering the products
  console.log('products in render:', products);
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard
            {...product}
            description={product.description || ''}
            images={product.images || []}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
