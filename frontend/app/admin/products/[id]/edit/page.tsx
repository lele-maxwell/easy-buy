"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/lib/api"

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
  image_url: string | null
  images?: string[]
}

interface Category {
  id: string
  name: string
  description: string | null
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image_url: "",
    images: [] as string[],
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          api.get(`/api/product/get/${params.id}`),
          api.get("/api/category/list"),
        ])

        const product: Product = productResponse.data
        setCategories(categoriesResponse.data)
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          stock_quantity: product.stock_quantity.toString(),
          category_id: product.category_id,
          image_url: product.image_url || "",
          images: product.images || [],
        })
        setImagePreviews(product.images || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to fetch product data")
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await api.put(`/api/product/update/${params.id}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id,
        image_url: formData.image_url,
        images: formData.images,
      })

      if (response.status === 200) {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Failed to update product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i])
    }
    try {
      const response = await fetch('/api/product/upload-image', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setImagePreviews(prev => [...prev, ...data.images])
      setFormData(prev => ({ ...prev, images: [...prev.images, ...data.images] }))
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/product/delete-image/${params.id}/${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      setImagePreviews(data.images)
      setFormData(prev => ({ ...prev, images: data.images }))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="text-white">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select value={formData.category_id} onValueChange={handleCategoryChange}>
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

            <div className="space-y-2">
              <Label className="text-white">Product Image</Label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-1 block w-full"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                    <button
                      onClick={() => handleDeleteImage(url)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 