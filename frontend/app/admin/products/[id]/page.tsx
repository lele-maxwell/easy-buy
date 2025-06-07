"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { ArrowLeft, Edit, Trash2, Archive } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/product/get/${params.id}`)
        setProduct(response.data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast.error("Failed to fetch product")
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await api.delete(`/api/product/delete/${params.id}`)
      toast.success("Product deleted successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleSoftDelete = async () => {
    if (!confirm("Are you sure you want to soft delete this product?")) return

    try {
      await api.delete(`/api/product/soft-delete/${params.id}`)
      toast.success("Product soft deleted successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to soft delete product:", error)
      toast.error("Failed to soft delete product")
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

  const getStatusColor = (deletedAt: string | null) => {
    return deletedAt ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-400"
    if (stock < 10) return "text-yellow-400"
    return "text-emerald-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {!product.deleted_at && (
            <Button
              variant="outline"
              onClick={handleSoftDelete}
              className="border-orange-600 text-orange-400 hover:bg-orange-500/10"
            >
              <Archive className="w-4 h-4 mr-2" />
              Soft Delete
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-red-600 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Name</h3>
              <p className="text-white">{product.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Status</h3>
              <Badge className={getStatusColor(product.deleted_at)}>
                {product.deleted_at ? "Deleted" : "Active"}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Price</h3>
              <p className="text-emerald-400 font-medium">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Stock</h3>
              <p className={getStockColor(product.stock_quantity)}>
                {product.stock_quantity === 0 ? "Out of Stock" : product.stock_quantity}
              </p>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Description</h3>
              <p className="text-white whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Created At</h3>
              <p className="text-white">
                {new Date(product.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Last Updated</h3>
              <p className="text-white">
                {new Date(product.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 