"use client"

import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />

        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-12">
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
              <p className="text-slate-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Shopping Cart</h1>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
                      <div className="w-20 h-20 bg-slate-600 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{item.name}</h3>
                        <p className="text-emerald-400 font-semibold">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 border-slate-600 text-white hover:bg-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="w-12 text-center text-white font-medium">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 border-slate-600 text-white hover:bg-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">Secure checkout with SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
