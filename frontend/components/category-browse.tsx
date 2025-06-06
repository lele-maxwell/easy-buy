'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and devices',
    icon: '📱'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion and accessories',
    icon: '👕'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Everything for your home',
    icon: '🏠'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Equipment and apparel',
    icon: '⚽'
  }
]

export default function CategoryBrowse() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="glass rounded-lg p-6 hover:bg-white/5 transition-colors"
        >
          <div className="text-4xl mb-4">{category.icon}</div>
          <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
          <p className="text-gray-400">{category.description}</p>
        </Link>
      ))}
    </div>
  )
}
