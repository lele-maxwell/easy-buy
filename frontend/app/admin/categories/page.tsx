"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, MoreHorizontal, Edit, Trash2, FolderOpen } from "lucide-react"

// Mock data - replace with actual API calls
const categories = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    productCount: 45,
    createdDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Clothing",
    description: "Fashion and apparel for all ages",
    productCount: 32,
    createdDate: "2024-01-01",
  },
  {
    id: "3",
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    productCount: 28,
    createdDate: "2024-01-01",
  },
  {
    id: "4",
    name: "Sports",
    description: "Sports equipment and fitness gear",
    productCount: 19,
    createdDate: "2024-01-01",
  },
  {
    id: "5",
    name: "Books",
    description: "Books and educational materials",
    productCount: 15,
    createdDate: "2024-01-01",
  },
  {
    id: "6",
    name: "Beauty",
    description: "Skincare, cosmetics, and personal care",
    productCount: 12,
    createdDate: "2024-01-01",
  },
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateCategory = () => {
    // Handle create category logic here
    console.log("Creating category:", formData)
    setIsCreateDialogOpen(false)
    setFormData({ name: "", description: "" })
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    // Handle update category logic here
    console.log("Updating category:", editingCategory.id, formData)
    setIsEditDialogOpen(false)
    setEditingCategory(null)
    setFormData({ name: "", description: "" })
  }

  const handleDeleteCategory = (categoryId: string) => {
    // Handle delete category logic here
    console.log("Deleting category:", categoryId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Category Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Categories</CardTitle>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                      <p className="text-sm text-slate-400">{category.productCount} products</p>
                    </div>
                  </div>

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
                      <DropdownMenuItem
                        onClick={() => handleEditCategory(category)}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-slate-300 text-sm mb-3">{category.description}</p>

                <div className="text-xs text-slate-500">Created: {category.createdDate}</div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">No categories found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-white">
                Category Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-white">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Update Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
