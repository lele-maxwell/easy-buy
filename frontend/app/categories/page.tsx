'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Headphones, Laptop, Smartphone, Watch, Camera } from 'lucide-react'

const categories = [
  {
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    icon: Laptop,
    href: '/products?category=electronics'
  },
  {
    name: 'Audio',
    description: 'Headphones, speakers, and audio equipment',
    icon: Headphones,
    href: '/products?category=audio'
  },
  {
    name: 'Smartphones',
    description: 'Latest mobile phones and accessories',
    icon: Smartphone,
    href: '/products?category=smartphones'
  },
  {
    name: 'Wearables',
    description: 'Smart watches and fitness trackers',
    icon: Watch,
    href: '/products?category=wearables'
  },
  {
    name: 'Cameras',
    description: 'Digital cameras and photography equipment',
    icon: Camera,
    href: '/products?category=cameras'
  },
  {
    name: 'Accessories',
    description: 'Essential accessories for your devices',
    icon: ShoppingBag,
    href: '/products?category=accessories'
  }
]

export default function CategoriesPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of product categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <category.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Button asChild>
                <a href={category.href}>Browse Products</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 