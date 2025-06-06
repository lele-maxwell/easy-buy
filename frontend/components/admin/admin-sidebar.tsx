"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Files", href: "/admin/files", icon: Upload },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {/* Decorative Cart Logo */}
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-emerald-500">
              {/* Cart body */}
              <path
                d="M6 8h20l-2 12H8L6 8z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Cart handle */}
              <path d="M6 8L4 4H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Cart wheels */}
              <circle cx="10" cy="26" r="2" fill="currentColor" />
              <circle cx="22" cy="26" r="2" fill="currentColor" />
              {/* Decorative elements */}
              <path d="M12 12v4M16 12v4M20 12v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              {/* Cart rim decoration */}
              <path d="M8 20h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Easy Buy</h1>
              <p className="text-xs text-emerald-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
