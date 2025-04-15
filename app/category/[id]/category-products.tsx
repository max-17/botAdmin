"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getProductsByCategory, getCategories } from "@/lib/data-service"
import type { Product, Category } from "@/lib/data-service"
import { useCart } from "@/components/cart-provider"

export default function CategoryProducts({ categoryId }: { categoryId: number }) {
  const [category, setCategory] = useState<Category | undefined>()
  const [products, setProducts] = useState<Product[]>([])
  const { cartCount } = useCart()

  useEffect(() => {
    const categories = getCategories()
    setCategory(categories.find((c) => c.id === categoryId))
    setProducts(getProductsByCategory(categoryId))
  }, [categoryId])

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{category?.name || "Товары"}</h1>
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

      {products.length === 0 ? (
        <p className="text-center py-10">В этой категории нет товаров</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}

