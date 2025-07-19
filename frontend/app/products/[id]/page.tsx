"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useParams } from "next/navigation"
import { products } from "@/lib/api"

// Mock reviews data
const reviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent sound quality and very comfortable to wear for long periods. The noise cancellation works great!",
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "2024-01-10",
    comment: "Good headphones overall. Battery life is impressive and the build quality feels premium.",
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2024-01-05",
    comment: "Best headphones I've ever owned. Worth every penny!",
  },
]

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  category: string
  image_url?: string | null
  images?: string[]
  // ...other fields as needed
}

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await products.get(params.id as string)
      setProduct(data)
    }
    fetchProduct()
  }, [params.id])

  if (!product) {
    return <div className="text-white">Loading...</div>
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[selectedImage] : "/placeholder.svg",
      quantity,
    })
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] : "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.images && product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-slate-800 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-emerald-500" : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-emerald-500/20 text-emerald-400 border-emerald-500">{product.category}</Badge>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-600"
                        }`}
                      />
                    ))}
                    <span className="text-slate-400 ml-2">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed mb-6">{product.description}</p>
              </div>

              <Separator className="bg-slate-700" />

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock_quantity > 10 ? "bg-emerald-500" : product.stock_quantity > 0 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
                <span className="text-slate-300">
                  {product.stock_quantity > 10 ? "In Stock" : product.stock_quantity > 0 ? `Only ${product.stock_quantity} left` : "Out of Stock"}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-600 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="text-white hover:bg-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-white min-w-[60px] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="text-white hover:bg-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`border-slate-600 hover:bg-slate-700 ${
                      isWishlisted ? "text-red-400 border-red-400" : "text-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="bg-slate-700" />

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-white font-medium">Free Shipping</div>
                    <div className="text-slate-400 text-sm">On orders over $50</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-white font-medium">2 Year Warranty</div>
                    <div className="text-slate-400 text-sm">Full coverage</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-white font-medium">30-Day Returns</div>
                    <div className="text-slate-400 text-sm">Easy returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="space-y-8">
                {/* Specifications */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Reviews */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{review.user}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-slate-400 text-sm">{review.date}</span>
                        </div>
                        <p className="text-slate-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
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
