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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {categories.map((category, i) => (
        <motion.div
          key={category.id}
          variants={item}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
        >
          <div className="relative p-8 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-black/80 border border-slate-800 shadow-2xl rounded-3xl backdrop-blur-md overflow-hidden group transition-transform hover:scale-105 hover:shadow-emerald-700/30 cursor-pointer">
            {/* Glow/gradient circle behind name */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl z-0" />
            <Link href={`/categories/${category.id}`} className="relative flex flex-col items-center text-center z-10">
              <h3 className="text-2xl font-extrabold mb-2 text-white tracking-tight drop-shadow">
                {category.name}
              </h3>
              <p className="text-slate-300 text-base leading-relaxed font-medium mb-4">
                {category.description || 'No description available'}
              </p>
            </Link>
            <motion.button
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-500/80 hover:bg-emerald-600/90 text-white rounded-full text-sm font-semibold shadow-lg backdrop-blur-md transition-colors z-20"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Details
            </motion.button>
            <AnimatePresence>
              {selectedCategory === category.id && categoryDetails[category.id as keyof typeof categoryDetails] && (
                <motion.div
                  variants={popup}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute z-30 w-full mt-2 bg-white rounded-lg shadow-lg p-4 left-0"
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
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
