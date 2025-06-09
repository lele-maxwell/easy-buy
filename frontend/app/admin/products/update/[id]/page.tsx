"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { ImageUpload, ImageGallery } from "@/components/ui/image-upload"

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
  images: string[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          api.get(`/api/products/get/${params.id}`),
          api.get("/api/list"),
        ])
        setProduct(productResponse.data)
        setCategories(categoriesResponse.data)
        
        // Set initial form data
        setFormData({
          name: productResponse.data.name,
          description: productResponse.data.description || "",
          price: productResponse.data.price.toString(),
          stock_quantity: productResponse.data.stock_quantity.toString(),
          category_id: productResponse.data.category_id,
        })
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to fetch product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await api.put(`/api/products/update/${params.id}`, {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id,
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

  const handleImageUploadComplete = (newImageUrl: string) => {
    if (product) {
      setProduct({
        ...product,
        images: [...product.images, newImageUrl]
      })
    }
    toast.success("Image uploaded successfully")
  }

  const handleImageUploadError = (error: string) => {
    toast.error(error)
  }

  const handleDeleteImage = async (imageUrl: string) => {
    if (!product) return
    setIsDeletingImage(true)

    try {
      await api.delete(`/api/products/delete-image/${params.id}`, {
        data: { image_url: imageUrl }
      })

      setProduct({
        ...product,
        images: product.images.filter(img => img !== imageUrl)
      })
      toast.success("Image deleted successfully")
    } catch (error) {
      console.error("Failed to delete image:", error)
      toast.error("Failed to delete image")
    } finally {
      setIsDeletingImage(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading product details...</div>
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400">
                    Product Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-400">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-400">
                    Category
                  </label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white">
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
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-400">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-slate-400">
                    Stock Quantity
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Product Images</h3>
              
              {product && (
                <>
                  <ImageGallery
                    images={product.images}
                    onDelete={handleDeleteImage}
                    isDeleting={isDeletingImage}
                  />
                  
                  <ImageUpload
                    productId={product.id}
                    onUploadComplete={handleImageUploadComplete}
                    onUploadError={handleImageUploadError}
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 