"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Archive } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get("/api/product"),
        api.get("/api/category/list"),
      ])
      setProducts(productsResponse.data)
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await api.delete(`/api/product/delete/${id}`)
      toast.success("Product deleted successfully")
      fetchData()
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft delete this product?")) return

    try {
      await api.delete(`/api/product/soft-delete/${id}`)
      toast.success("Product soft deleted successfully")
      fetchData()
    } catch (error) {
      console.error("Failed to soft delete product:", error)
      toast.error("Failed to soft delete product")
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && !product.deleted_at) ||
      (statusFilter === "deleted" && product.deleted_at)
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (deletedAt: string | null) => {
    return deletedAt ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-400"
    if (stock < 10) return "text-yellow-400"
    return "text-emerald-400"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Products</CardTitle>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-white hover:bg-slate-700">
                  Active
                </SelectItem>
                <SelectItem value="deleted" className="text-white hover:bg-slate-700">
                  Deleted
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Categories
                </SelectItem>
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
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-slate-400">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{product.id}</td>
                    <td className="py-4 px-4 text-slate-300">{getCategoryName(product.category_id)}</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={getStockColor(product.stock_quantity)}>
                        {product.stock_quantity === 0 ? "Out of Stock" : product.stock_quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(product.deleted_at)}>
                        {product.deleted_at ? "Deleted" : "Active"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-600"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {!product.deleted_at && (
                            <DropdownMenuItem 
                              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                              onClick={() => handleSoftDelete(product.id)}
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Soft Delete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">No products found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
