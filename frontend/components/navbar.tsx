"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Category' },
    { href: '/products', label: 'Product' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-12 h-12 sm:w-16 sm:h-16"
            >
              <Image
                src="/easy buy logo G.jpg"
                alt="EasyBuy Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
                quality={100}
              />
            </motion.div>
            <motion.span 
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              EasyBuy
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-4 bg-slate-800/50 p-2 rounded-lg">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-200 text-base sm:text-lg ${
                          isActive 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 rounded-md bg-primary/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-slate-300 hover:text-white text-sm sm:text-base px-4 py-2">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={logout}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm sm:text-base px-4 py-2"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white w-10 h-10">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-slate-300 hover:text-white text-sm sm:text-base px-4 py-2">
                      <User className="w-5 h-5 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-4 py-2">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white w-10 h-10">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start px-4 py-3 text-base ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
                {!user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-slate-800">
                    <Link href="/auth/login">
                      <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                        <User className="w-5 h-5 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                        Register
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-slate-800">
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
