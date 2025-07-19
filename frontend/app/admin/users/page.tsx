"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Edit, UserX, Shield } from "lucide-react"
import { admin } from "@/lib/api"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

// Remove mock data - replace with actual API calls
// const users = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john@example.com",
//     role: "customer",
//     registrationDate: "2024-01-15",
//     status: "active",
//     orders: 5,
//   },
//   {
//     id: "2",
//     name: "Sarah Smith",
//     email: "sarah@example.com",
//     role: "customer",
//     registrationDate: "2024-01-10",
//     status: "active",
//     orders: 12,
//   },
//   {
//     id: "3",
//     name: "Admin User",
//     email: "admin@easybuy.com",
//     role: "admin",
//     registrationDate: "2023-12-01",
//     status: "active",
//     orders: 0,
//   },
//   {
//     id: "4",
//     name: "Mike Johnson",
//     email: "mike@example.com",
//     role: "customer",
//     registrationDate: "2024-01-08",
//     status: "suspended",
//     orders: 3,
//   },
//   {
//     id: "5",
//     name: "Emily Brown",
//     email: "emily@example.com",
//     role: "customer",
//     registrationDate: "2024-01-05",
//     status: "active",
//     orders: 8,
//   },
// ]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await admin.users.list()
        setUsers(data)
      } catch (err: any) {
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    // No status in backend, so always true
    const matchesStatus = true
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "user":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  // Mock function to get user details (replace with real API later)
  const getUserDetails = (user: any) => {
    return {
      ...user,
      status: ["active", "inactive", "suspended"][Math.floor(Math.random() * 3)],
      lastLogin: "2024-06-01 14:23:00",
      registrationDate: "2023-12-01",
      orders: Math.floor(Math.random() * 20),
      totalSpent: `$${(Math.random() * 1000).toFixed(2)}`,
      address: "123 Main St, City, Country",
      phone: "+1234567890",
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading users...</div>
  }
  if (error) {
    return <div className="text-center py-12 text-red-400">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="text-slate-400">Total Users: {users.length}</div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Roles
                </SelectItem>
                <SelectItem value="user" className="text-white hover:bg-slate-700">
                  User
                </SelectItem>
                <SelectItem value="admin" className="text-white hover:bg-slate-700">
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter removed since backend does not provide status */}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Dialog open={detailsOpen && selectedUser?.id === user.id} onOpenChange={(open) => { setDetailsOpen(open); if (!open) setSelectedUser(null) }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-600"
                            onClick={() => { setSelectedUser(getUserDetails(user)); setDetailsOpen(true) }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>More information about this user.</DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-2">
                              <div><span className="font-semibold">Name:</span> {selectedUser.name}</div>
                              <div><span className="font-semibold">Email:</span> {selectedUser.email}</div>
                              <div><span className="font-semibold">Role:</span> {selectedUser.role}</div>
                              <div><span className="font-semibold">Status:</span> {selectedUser.status}</div>
                              <div><span className="font-semibold">Last Login:</span> {selectedUser.lastLogin}</div>
                              <div><span className="font-semibold">Registration Date:</span> {selectedUser.registrationDate}</div>
                              <div><span className="font-semibold">Orders:</span> {selectedUser.orders}</div>
                              <div><span className="font-semibold">Total Spent:</span> {selectedUser.totalSpent}</div>
                              <div><span className="font-semibold">Address:</span> {selectedUser.address}</div>
                              <div><span className="font-semibold">Phone:</span> {selectedUser.phone}</div>
                            </div>
                          )}
                          <DialogClose asChild>
                            <Button className="mt-4 w-full">Close</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">No users found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
