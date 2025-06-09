"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { api } from "@/lib/api"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description: string | null
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  category_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
}

export default function ViewProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, imagesResponse] = await Promise.all([
          api.get(`/api/products/get/${params.id}`),
          api.get(`/api/product-images/${params.id}`)
        ])
        setProduct(productResponse.data)
        setImages(imagesResponse.data)

        // Fetch category details
        const categoryResponse = await api.get(`/api/list/${productResponse.data.category_id}`)
        setCategory(categoryResponse.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to fetch product data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Product not found</div>
      </div>
    )
  }

  const primaryImage = images.find(img => img.is_primary) || images[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Product Details</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            Back to Products
          </Button>
          <Button
            onClick={() => router.push(`/admin/products/edit/${params.id}`)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-400">Name</h3>
              <p className="text-white mt-1">{product.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400">Description</h3>
              <p className="text-white mt-1">{product.description || "No description provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400">Category</h3>
              <p className="text-white mt-1">{category?.name || "Unknown Category"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-400">Price</h3>
                <p className="text-white mt-1">${product.price.toFixed(2)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400">Stock Quantity</h3>
                <p className={`mt-1 ${product.stock_quantity === 0 ? 'text-red-400' : product.stock_quantity < 10 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {product.stock_quantity} units
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400">Status</h3>
              <Badge
                className={`mt-1 ${
                  product.deleted_at
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {product.deleted_at ? "Deleted" : "Active"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-700"
                  >
                    <Image
                      src={image.image_url}
                      alt="Product image"
                      fill
                      className="object-cover"
                    />
                    {image.is_primary && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No images uploaded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 