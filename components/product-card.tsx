"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AvailabilityBadge from "@/components/availability-badge"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/data-service"
import type { Product } from "@/lib/data-service"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product.id, 1)
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в корзину`,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
          <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start">
                <Link href={`/product/${product.id}`} className="hover:underline">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <AvailabilityBadge isAvailable={true} />
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="font-bold">${formatPrice(product.price)}</p>

              <Button size="sm" className="h-8" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Добавить в корзину</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

