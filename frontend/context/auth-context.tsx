'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { auth } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for token and user data in cookies
    const token = Cookies.get('token')
    const userData = Cookies.get('userData')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        Cookies.remove('token')
        Cookies.remove('userData')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password)
      const { token, user } = response

      // Store token and user data in cookies
      Cookies.set('token', token, { expires: 7 }) // 7 days expiry
      Cookies.set('userData', JSON.stringify(user), { expires: 7 })
      Cookies.set('userRole', user.role, { expires: 7 })

      setUser(user)
      router.push('/products')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password)
      const { token, user } = response

      // Store token and user data in cookies
      Cookies.set('token', token, { expires: 7 })
      Cookies.set('userData', JSON.stringify(user), { expires: 7 })
      Cookies.set('userRole', user.role, { expires: 7 })

      setUser(user)
      router.push('/products')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    Cookies.remove('userData')
    Cookies.remove('userRole')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 