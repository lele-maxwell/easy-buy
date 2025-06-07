'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/cart-context'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-md bg-slate-900 shadow-xl"
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {items.map((item) => (
            <Card key={item.id} className="p-4 bg-slate-800/50">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-emerald-400">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-white">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex justify-between mb-4">
            <span className="text-slate-400">Total</span>
            <span className="text-xl font-semibold text-white">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
            Checkout
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 