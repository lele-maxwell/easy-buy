"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { products } from "@/lib/api"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  created_at: string | null
  updated_at: string | null
  image_url?: string | null
  images?: string[] | null
}

interface Filters {
  category: string
  minPrice: string
  maxPrice: string
  inStock: boolean
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await products.list();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    if (filters.inStock && product.stock_quantity === 0) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              To fix this issue:
              <br />1. Make sure the backend server is running
              <br />2. Check if it's running on http://localhost:8000
              <br />3. Verify that the API endpoint /api/product exists
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product}>
                <Image
                  src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </ProductCard>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
