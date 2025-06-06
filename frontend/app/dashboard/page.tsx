"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Verify token and get user info
    const timeout = setTimeout(() => {
      localStorage.removeItem("token")
      router.push("/auth/login")
    }, 5000) // 5 second timeout

    auth.verifyToken()
      .then(data => {
        clearTimeout(timeout)
        setUser(data)
      })
      .catch(() => {
        clearTimeout(timeout)
        localStorage.removeItem("token")
        router.push("/auth/login")
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/auth/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-4">Your Account</h2>
            <p className="text-muted-foreground mb-6">
              Welcome to your personal dashboard! Here you can manage your account and explore our products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                🛍️ Shop Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/profile')}
                className="px-8 py-6 text-lg"
              >
                👤 View Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Browse all products</li>
                <li>• View your cart</li>
                <li>• Check order history</li>
                <li>• Update profile settings</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you with any questions or concerns.
              </p>
              <Button variant="link" className="p-0">
                Contact Support →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 