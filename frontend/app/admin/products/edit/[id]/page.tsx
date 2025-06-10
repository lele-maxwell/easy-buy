"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { ImageUpload } from "@/components/ImageUpload"
import { ImageGallery } from "@/components/ImageGallery"

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

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse, imagesResponse] = await Promise.all([
          api.get(`/api/products/get/${params.id}`),
          api.get("/api/list"),
          api.get(`/api/product-images/${params.id}`)
        ])
        setProduct(productResponse.data)
        setCategories(categoriesResponse.data)
        setImages(imagesResponse.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to fetch product data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSaving(true)
    try {
      await api.put(`/api/products/update/${params.id}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
      })
      toast.success("Product updated successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImagesChange = async () => {
    try {
      const response = await api.get(`/api/product-images/${params.id}`)
      setImages(response.data)
    } catch (error) {
      console.error("Failed to fetch images:", error)
      toast.error("Failed to refresh images")
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="text-white border-slate-600 hover:bg-slate-700"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={product.description || ""}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-white">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={product.stock_quantity}
                  onChange={(e) => setProduct({ ...product, stock_quantity: parseInt(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select
                value={product.category_id}
                onValueChange={(value) => setProduct({ ...product, category_id: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="text-white hover:bg-slate-700"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageGallery
              productId={params.id}
              images={images}
              onImagesChange={handleImagesChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUpload
                productId={params.id}
                onUploadComplete={handleImagesChange}
                isPrimary={images.length === 0}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 