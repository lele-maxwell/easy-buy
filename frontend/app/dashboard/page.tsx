"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, CreditCard, Settings } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else if (user.role.toLowerCase() === 'admin') {
        router.push("/admin")
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

  if (!user || user.role.toLowerCase() === 'admin') {
    return null
  }

  const userFeatures = [
    {
      title: 'My Orders',
      description: 'View and track your orders',
      icon: ShoppingCart,
      href: '/orders'
    },
    {
      title: 'Products',
      description: 'Browse our product catalog',
      icon: Package,
      href: '/products'
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options',
      icon: CreditCard,
      href: '/payment-methods'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/settings'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userFeatures.map((feature) => (
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
                View
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 