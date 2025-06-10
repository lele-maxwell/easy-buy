"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Filter } from "lucide-react"

// Mock data - replace with actual API calls
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 129.99,
    status: "delivered",
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    total: 89.5,
    status: "shipped",
    date: "2024-01-14",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 199.99,
    status: "pending",
    date: "2024-01-14",
    items: 3,
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    email: "emily@example.com",
    total: 45.0,
    status: "processing",
    date: "2024-01-13",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    email: "david@example.com",
    total: 299.99,
    status: "delivered",
    date: "2024-01-13",
    items: 4,
  },
  {
    id: "ORD-006",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    total: 75.5,
    status: "cancelled",
    date: "2024-01-12",
    items: 2,
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Order Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search orders, customers..."
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
                <SelectItem value="pending" className="text-white hover:bg-slate-700">
                  Pending
                </SelectItem>
                <SelectItem value="processing" className="text-white hover:bg-slate-700">
                  Processing
                </SelectItem>
                <SelectItem value="shipped" className="text-white hover:bg-slate-700">
                  Shipped
                </SelectItem>
                <SelectItem value="delivered" className="text-white hover:bg-slate-700">
                  Delivered
                </SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-slate-700">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Time
                </SelectItem>
                <SelectItem value="today" className="text-white hover:bg-slate-700">
                  Today
                </SelectItem>
                <SelectItem value="week" className="text-white hover:bg-slate-700">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-white hover:bg-slate-700">
                  This Month
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
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Items</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-white">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-white">{order.customer}</div>
                        <div className="text-sm text-slate-400">{order.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{order.date}</td>
                    <td className="py-4 px-4 text-slate-300">{order.items} items</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-slate-600"
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">No orders found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
