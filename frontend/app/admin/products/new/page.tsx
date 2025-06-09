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
import { ProductImageUpload, ImageGallery } from "@/components/admin/product-image-upload"

interface Category {
  id: string
  name: string
  description: string | null
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [productId, setProductId] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/list")
        setCategories(response.data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast.error("Failed to fetch categories")
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post("/api/products", {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id || null,
      })

      setProductId(response.data.id)
      toast.success("Product created successfully! You can now upload images.", {
        duration: 5000,
        position: "top-center",
      })
    } catch (error) {
      console.error("Failed to create product:", error)
      toast.error("Failed to create product", {
        duration: 3000,
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }))
  }

  const handleImageUploadComplete = (newImageUrl: string) => {
    setImages(prev => [...prev, newImageUrl])
    toast.success("Image uploaded successfully")
  }

  const handleImageUploadError = (error: string) => {
    toast.error(error)
  }

  const handleImageDelete = async (imageUrl: string) => {
    setIsDeleting(true)
    try {
      setImages(prevImages => prevImages.filter(img => img !== imageUrl))
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast.error('Failed to delete image')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Add New Product</h1>
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

            {/* Image Upload Section */}
            {productId && (
              <div className="space-y-4">
                <Label className="text-white">Product Images</Label>
                <ImageGallery 
                  images={images} 
                  productId={productId}
                  onDelete={handleImageDelete}
                  isDeleting={isDeleting}
                />
                <ProductImageUpload
                  productId={productId}
                  onUploadComplete={handleImageUploadComplete}
                  onUploadError={handleImageUploadError}
                />
              </div>
            )}

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
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 