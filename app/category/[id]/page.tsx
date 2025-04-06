"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import MobileHeader from "@/components/mobile-header"
import { getProductsByCategory, getCategories } from "@/lib/data-service"
import type { Product, Category } from "@/lib/data-service"
import { useCart } from "@/components/cart-provider"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  const [category, setCategory] = useState<Category | undefined>()
  const [products, setProducts] = useState<Product[]>([])
  const { cartCount } = useCart()

  useEffect(() => {
    const categories = getCategories()
    setCategory(categories.find((c) => c.id === categoryId))
    setProducts(getProductsByCategory(categoryId))
  }, [categoryId])

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title={category?.name || "Товары"} backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}

