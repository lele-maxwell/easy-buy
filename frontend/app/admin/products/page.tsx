"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Archive } from "lucide-react"

// Mock data - replace with actual API calls
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    stock: 15,
    category: "Electronics",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    stock: 50,
    category: "Clothing",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    price: 89.99,
    stock: 0,
    category: "Electronics",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "4",
    name: "Yoga Mat Premium",
    price: 39.99,
    stock: 25,
    category: "Sports",
    status: "soft-deleted",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "5",
    name: "Ceramic Coffee Mug Set",
    price: 24.99,
    stock: 12,
    category: "Home & Garden",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "soft-deleted":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-400"
    if (stock < 10) return "text-yellow-400"
    return "text-emerald-400"
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

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Categories
                </SelectItem>
                <SelectItem value="Electronics" className="text-white hover:bg-slate-700">
                  Electronics
                </SelectItem>
                <SelectItem value="Clothing" className="text-white hover:bg-slate-700">
                  Clothing
                </SelectItem>
                <SelectItem value="Sports" className="text-white hover:bg-slate-700">
                  Sports
                </SelectItem>
                <SelectItem value="Home & Garden" className="text-white hover:bg-slate-700">
                  Home & Garden
                </SelectItem>
              </SelectContent>
            </Select>

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
                <SelectItem value="soft-deleted" className="text-white hover:bg-slate-700">
                  Soft Deleted
                </SelectItem>
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
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-600"
                        />
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{product.id}</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={getStockColor(product.stock)}>
                        {product.stock === 0 ? "Out of Stock" : product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{product.category}</td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status === "soft-deleted" ? "Deleted" : "Active"}
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
                          <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
                            <Archive className="w-4 h-4 mr-2" />
                            Soft Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
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
