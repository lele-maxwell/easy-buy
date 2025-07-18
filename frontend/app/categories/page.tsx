'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Headphones, Laptop, Smartphone, Watch, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

const iconMap: Record<string, any> = {
  electronics: Laptop,
  audio: Headphones,
  smartphones: Smartphone,
  wearables: Watch,
  cameras: Camera,
  accessories: ShoppingBag,
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/category/list')
        setCategories(response.data)
      } catch (err) {
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of product categories
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, i) => {
            const Icon = iconMap[category.name?.toLowerCase().replace(/ /g, '')] || ShoppingBag
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.7, type: 'spring' }}
                viewport={{ once: true }}
              >
                <Card className="p-8 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-black/80 border border-slate-800 shadow-2xl rounded-3xl backdrop-blur-md relative overflow-hidden group transition-transform hover:scale-105 hover:shadow-emerald-700/30">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl z-0" />
                  <div className="relative flex flex-col items-center text-center z-10">
                    <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900/40 shadow-inner border-2 border-emerald-700/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-emerald-400 drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-2 text-white tracking-tight drop-shadow">
                      {category.name}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium mb-4">
                      {category.description || 'No description available'}
                    </p>
                    <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg font-semibold">
                      <a href={`/products?category=${category.id}`}>Browse Products</a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
} 