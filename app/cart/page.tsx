"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import MobileHeader from "@/components/mobile-header"
import StockBadge from "@/components/stock-badge"
import { getCartWithDetails } from "@/lib/data-service"
import { useCart } from "@/components/cart-provider"

export default function CartPage() {
  const { updateCartItem, removeFromCart } = useCart()
  const [cartDetails, setCartDetails] = useState({ items: [], subtotal: 0 })

  useEffect(() => {
    setCartDetails(getCartWithDetails())
  }, [])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartItem(productId, newQuantity)
    setCartDetails(getCartWithDetails())
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    setCartDetails(getCartWithDetails())
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Корзина" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ваша корзина</h1>

        {cartDetails.items.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="mb-4">Ваша корзина пуста</p>
            <Link href="/">
              <Button>Продолжить покупки</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartDetails.items.map((item) => (
                <Card key={item.productId} className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>

                      <StockBadge status={item.product.stockStatus} />

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Подытог</span>
                <span>${cartDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Доставка</span>
                <span>$5.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>${(cartDetails.subtotal + 5).toFixed(2)}</span>
              </div>
            </Card>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Перейти к оформлению
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

