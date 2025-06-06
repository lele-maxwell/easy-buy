import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Users, FolderOpen, Upload } from "lucide-react"

const quickActions = [
  {
    title: "Add Product",
    description: "Create a new product",
    href: "/admin/products/new",
    icon: Package,
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    title: "Add Category",
    description: "Create a new category",
    href: "/admin/categories/new",
    icon: FolderOpen,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Upload Files",
    description: "Upload product images",
    href: "/admin/files",
    icon: Upload,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Manage Users",
    description: "View all users",
    href: "/admin/users",
    icon: Users,
    color: "bg-orange-500 hover:bg-orange-600",
  },
]

export default function QuickActions() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
        <p className="text-slate-400 text-sm">Common administrative tasks</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Button
                key={action.title}
                asChild
                variant="ghost"
                className="h-auto p-4 justify-start text-left hover:bg-slate-700"
              >
                <Link href={action.href}>
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{action.title}</div>
                    <div className="text-sm text-slate-400">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
