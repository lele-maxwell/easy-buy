'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Package, 
  Tag, 
  Percent, 
  BarChart2, 
  Users, 
  Settings 
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log('Admin page - Current user:', user)
    console.log('Admin page - Loading state:', loading)
    
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login')
        router.replace('/auth/login')
      } else if (user.role.toLowerCase() !== 'admin') {
        console.log('User is not admin, redirecting to home')
        router.replace('/')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user || user.role.toLowerCase() !== 'admin') {
    return null
  }

  const adminFeatures = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      href: '/admin/products'
    },
    {
      title: 'Categories',
      description: 'Organize your products',
      icon: Tag,
      href: '/admin/categories'
    },
    {
      title: 'Promotions',
      description: 'Create and manage promotions',
      icon: Percent,
      href: '/admin/promotions'
    },
    {
      title: 'Analytics',
      description: 'View sales and market data',
      icon: BarChart2,
      href: '/admin/analytics'
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: 'Settings',
      description: 'Configure your store',
      icon: Settings,
      href: '/admin/settings'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Card 
              key={feature.title}
              className="p-6 bg-slate-800 border-slate-700 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <feature.icon className="w-8 h-8 text-emerald-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => router.push(feature.href)}
              >
                Manage
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
