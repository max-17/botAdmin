"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import AvailabilityBadge from "@/components/availability-badge"
import { getProduct, formatPrice } from "@/lib/data-service"
import type { Product } from "@/lib/data-service"
import { useCart } from "@/components/cart-provider"

export default function ProductDetail({ productId }: { productId: number }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchedProduct = getProduct(productId)
    if (fetchedProduct) {
      setProduct(fetchedProduct)
    } else {
      router.push("/")
    }
  }, [productId, router])

  if (!product) {
    return <p className="text-center py-10">Товар не найден</p>
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
    toast({
      title: "Добавлено в корзину",
      description: `${quantity} x ${product.name} добавлено в корзину`,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-64">
        <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <AvailabilityBadge isAvailable={true} />
        </div>

        <p className="text-2xl font-bold mb-4">${formatPrice(product.price)}</p>

        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-lg font-bold">Итого: ${((product.price * quantity) / 100).toFixed(2)}</p>
        </div>

        <Button className="w-full" size="lg" onClick={handleAddToCart}>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Добавить в корзину
        </Button>
      </div>
    </Card>
  )
}

