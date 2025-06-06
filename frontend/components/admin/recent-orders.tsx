import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

// Mock data - replace with actual API calls
const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 129.99,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    total: 89.5,
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 199.99,
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    email: "emily@example.com",
    total: 45.0,
    status: "processing",
    date: "2024-01-13",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    email: "david@example.com",
    total: 299.99,
    status: "delivered",
    date: "2024-01-13",
  },
]

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
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
  }
}

export default function RecentOrders() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <p className="text-slate-400 text-sm">Latest customer orders</p>
        </div>
        <Button asChild variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Link href="/admin/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-white">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="text-sm text-slate-400">
                  {order.customer} • {order.email}
                </div>
                <div className="text-xs text-slate-500 mt-1">{order.date}</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-emerald-400">${order.total.toFixed(2)}</div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-600"
                >
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
