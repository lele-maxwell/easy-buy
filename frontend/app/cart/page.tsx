"use client"

import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Minus, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

function getImageUrl(url: string) {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http")) return url;
  return `http://localhost:8000${url}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center text-slate-400">
          <ShoppingCart className="mx-auto mb-4 w-12 h-12" />
          <p>Your cart is empty.</p>
          <Link href="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4 p-4 bg-slate-800/80">
              <div className="w-24 h-24 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-lg truncate">{item.name}</h3>
                <p className="text-emerald-400 font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-white font-medium text-lg">{item.quantity}</span>
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
              <div className="flex flex-col items-end gap-2">
                <span className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
          <div className="flex justify-between items-center mt-8 border-t border-slate-700 pt-6">
            <span className="text-xl font-bold text-white">Total:</span>
            <span className="text-2xl font-bold text-emerald-400">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-6">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-lg px-8 py-3 rounded-full shadow-lg">
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
