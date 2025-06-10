"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

// Mock data - replace with actual API calls
const categoryData = [
  { name: "Electronics", value: 35, color: "#10b981" },
  { name: "Clothing", value: 25, color: "#34d399" },
  { name: "Home & Garden", value: 20, color: "#6ee7b7" },
  { name: "Sports", value: 12, color: "#a7f3d0" },
  { name: "Books", value: 8, color: "#d1fae5" },
]

export default function TopCategories() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Top Categories</CardTitle>
        <p className="text-slate-400 text-sm">Sales by category</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2 mt-4">
          {categoryData.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-slate-300 text-sm">{category.name}</span>
              </div>
              <span className="text-slate-400 text-sm">{category.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
