'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { auth } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string  // Allow any string, we'll handle case-insensitive comparison
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token')
      const userData = Cookies.get('userData')
      const userRole = Cookies.get('userRole')

      if (token && userData) {
        try {
          // Verify token with backend
          const verificationResult = await auth.verifyToken()
          if (verificationResult.isValid) {
            const parsedUserData = JSON.parse(userData)
            setUser(parsedUserData)
            
            // If we're on an admin route but not an admin, redirect
            if (window.location.pathname.startsWith('/admin')) {
              if (userRole?.toLowerCase() !== 'admin') {
                console.log('Not an admin, redirecting to home')
                router.replace('/')
              } else {
                console.log('Admin verified, staying on admin page')
              }
            }
          } else {
            console.log('Token invalid, clearing auth data')
            // Token is invalid, clear everything
            Cookies.remove('token')
            Cookies.remove('userData')
            Cookies.remove('userRole')
            setUser(null)
            router.replace('/auth/login')
          }
        } catch (error) {
          console.error('Token verification error:', error)
          Cookies.remove('token')
          Cookies.remove('userData')
          Cookies.remove('userRole')
          setUser(null)
          router.replace('/auth/login')
        }
      } else {
        // No token or user data, redirect to login if on protected route
        if (window.location.pathname.startsWith('/admin')) {
          router.replace('/auth/login')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email })
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Please provide both email and password')
      }

      const response = await auth.login(email, password)
      console.log('Login response received:', response)

      // The API layer now ensures the response has the correct structure
      const { token, user: userData } = response
      console.log('User data from login:', userData)

      // Store token and user data in cookies with 7-day expiry
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' })
      Cookies.set('userData', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'strict' })
      Cookies.set('userRole', userData.role, { expires: 7, secure: true, sameSite: 'strict' })

      setUser(userData)
      
      // Redirect based on user role
      console.log('User role:', userData.role)
      if (userData.role.toLowerCase() === 'admin') {
        console.log('Redirecting to admin dashboard')
        // Force a hard navigation to ensure the page reloads
        window.location.href = '/admin'
      } else {
        console.log('Redirecting to user dashboard')
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      })
      
      // Rethrow the error with a user-friendly message
      if (error.message.includes('Invalid email or password')) {
        throw new Error('Invalid email or password')
      } else if (error.message.includes('Network error')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.')
      } else if (error.message.includes('Server error')) {
        throw new Error('Server error occurred. Please try again later.')
      } else {
        throw new Error(error.message || 'An unexpected error occurred. Please try again.')
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password)
      const { token, user: userData } = response

      if (!token || !userData) {
        throw new Error('Invalid response from server')
      }

      // Ensure user data has all required fields
      const user: User = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user' // Default to 'user' if role is not provided
      }

      // Store token and user data in cookies with 7-day expiry
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' })
      Cookies.set('userData', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' })
      Cookies.set('userRole', user.role, { expires: 7, secure: true, sameSite: 'strict' })

      setUser(user)
      router.push('/dashboard')
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
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        isAuthenticated: !!user 
      }}
    >
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