"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

interface Filters {
  category: string
  minPrice: string
  maxPrice: string
  inStock: boolean
}

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports' },
]

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  const updateFilter = (key: keyof Filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    })
  }

  const hasActiveFilters =
    (filters.category && filters.category !== "all") || filters.minPrice || filters.maxPrice || filters.inStock

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    setSelectedCategories(newCategories)
    updateFilter("category", newCategories.length > 0 ? newCategories[0] : "all")
  }

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setPriceRange(newRange)
    updateFilter("minPrice", value[0].toString())
    updateFilter("maxPrice", value[1].toString())
  }

  const handleReset = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    clearFilters()
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        >
          Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
        </Button>
      </div>

      {/* Filter Panel */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-6`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-slate-700"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <Separator className="bg-slate-700" />

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Category</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-categories"
                checked={filters.category === "all" || !filters.category}
                onCheckedChange={(checked) => {
                  updateFilter("category", checked ? "all" : "all")
                }}
                className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <Label htmlFor="all-categories" className="text-slate-300 hover:text-white cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Label htmlFor={category.id} className="text-slate-300 hover:text-white cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Price Range</Label>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-300">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Stock Filter */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter("inStock", !!checked)}
              className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <Label htmlFor="inStock" className="text-slate-300 hover:text-white cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </div>

        {/* Mobile Close Button */}
        <div className="lg:hidden pt-4">
          <Button onClick={() => setIsOpen(false)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
