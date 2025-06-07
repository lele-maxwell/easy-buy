"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  description: string | null
  created_at: string | null
  updated_at: string | null
}

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Gaming',
    description: 'Gaming consoles, accessories, and games',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Audio',
    description: 'Headphones, speakers, and audio equipment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Computers',
    description: 'Laptops, desktops, and computer accessories',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Mobile Devices',
    description: 'Smartphones, tablets, and mobile accessories',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Smart Home',
    description: 'Smart home devices and automation solutions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock details for each category
const categoryDetails = {
  '1': {
    totalProducts: 156,
    topSelling: ['Smartphones', 'Laptops', 'Tablets'],
    newArrivals: 12,
    avgRating: 4.5
  },
  '2': {
    totalProducts: 89,
    topSelling: ['Gaming Consoles', 'Gaming Mice', 'Gaming Headsets'],
    newArrivals: 8,
    avgRating: 4.7
  },
  '3': {
    totalProducts: 112,
    topSelling: ['Wireless Earbuds', 'Bluetooth Speakers', 'Soundbars'],
    newArrivals: 15,
    avgRating: 4.3
  },
  '4': {
    totalProducts: 203,
    topSelling: ['Laptops', 'Desktops', 'Monitors'],
    newArrivals: 20,
    avgRating: 4.6
  },
  '5': {
    totalProducts: 178,
    topSelling: ['Smartphones', 'Tablets', 'Smartwatches'],
    newArrivals: 18,
    avgRating: 4.4
  },
  '6': {
    totalProducts: 94,
    topSelling: ['Smart Lights', 'Security Cameras', 'Smart Speakers'],
    newArrivals: 10,
    avgRating: 4.2
  }
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

const popup: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

export default function CategoryBrowse() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const response = await api.get('/api/category/list')
        console.log('Categories response:', response.data)
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format')
        }
        
        setCategories(response.data)
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching categories:', err)
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: err.config
        })
        
        // Use mock data when API call fails
        console.log('Using mock data due to API error')
        setCategories(mockCategories)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            className="relative h-32 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-emerald-800" />
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

  if (categories.length === 0) {
    // Use mock data when no categories are available
    setCategories(mockCategories)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category) => (
        <motion.div 
          key={category.id} 
          variants={item}
          className="relative"
        >
          <Link href={`/categories/${category.id}`}>
            <motion.div
              className="relative h-32 rounded-lg overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-emerald-800" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {category.description || 'No description available'}
                </p>
              </div>
            </motion.div>
          </Link>
          
          <motion.button
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className="absolute bottom-2 right-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details
          </motion.button>
          
          <AnimatePresence>
            {selectedCategory === category.id && (
              <motion.div
                variants={popup}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg p-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Products:</span>
                    <span className="font-semibold text-emerald-600">{categoryDetails[category.id as keyof typeof categoryDetails].totalProducts}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Top Selling:</span>
                    <ul className="mt-1 space-y-1">
                      {categoryDetails[category.id as keyof typeof categoryDetails].topSelling.map((item, index) => (
                        <li key={index} className="text-sm text-slate-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New Arrivals:</span>
                    <span className="font-semibold text-emerald-600">{categoryDetails[category.id as keyof typeof categoryDetails].newArrivals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average Rating:</span>
                    <span className="font-semibold text-emerald-600">{categoryDetails[category.id as keyof typeof categoryDetails].avgRating} ★</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  )
}
