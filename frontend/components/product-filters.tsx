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
    <div className="sticky top-20 z-40 w-full max-w-xs text-sm">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between text-sm bg-deepnavy/60 border border-gold/30 text-cream font-semibold rounded-xl shadow-inner hover:bg-emerald/10 hover:text-emerald"
      >
        Filters
        <span className="ml-2 text-xs bg-emerald text-softblack px-2 py-1 rounded-full border border-gold/40 font-bold">
          {hasActiveFilters ? "Active" : "0"}
        </span>
      </Button>

      {isOpen && (
        <div className="mt-3 p-4 border border-earthy-caramel/40 rounded-2xl bg-gradient-to-br from-softblack/90 via-deepnavy/80 to-black/80 shadow-2xl backdrop-blur-md space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-cream tracking-wide">Filters</h3>
            {hasActiveFilters && (
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="text-emerald hover:text-gold hover:bg-emerald/10 font-semibold"
              >
                Reset Filters
              </Button>
            )}
          </div>

          <Separator className="bg-gold/30" />

          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-cream font-semibold">Category</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-categories"
                  checked={filters.category === "all" || !filters.category}
                  onCheckedChange={(checked) => {
                    updateFilter("category", checked ? "all" : "all")
                  }}
                  className="border-gold/40 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                />
                <Label htmlFor="all-categories" className="text-cream hover:text-emerald cursor-pointer">
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                    className="border-gold/40 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                  <Label htmlFor={category.id} className="text-cream hover:text-emerald cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gold/30" />

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Label className="text-cream font-semibold">Price Range</Label>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-cream/80">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gold/30" />

          {/* Stock Filter */}
          <div className="space-y-3">
            <Label className="text-cream font-semibold">Availability</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilter("inStock", !!checked)}
                className="border-gold/40 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
              />
              <Label htmlFor="inStock" className="text-cream hover:text-emerald cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>

          {/* Mobile Close Button */}
          <div className="lg:hidden pt-4">
            <Button onClick={() => setIsOpen(false)} className="w-full bg-emerald hover:bg-gold text-softblack font-bold border border-gold/40 shadow-lg">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
