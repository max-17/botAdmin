"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MobileHeader from "@/components/mobile-header"
import { getOrders } from "@/lib/data-service"
import type { Order } from "@/lib/data-service"
import { useCart } from "@/components/cart-provider"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const handleReorder = (order: Order) => {
    // Add all items from the order to the cart
    order.items.forEach((item) => {
      addToCart(item.productId, item.quantity)
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Processing":
        return "Обработка"
      case "Dispatched":
        return "Отправлен"
      case "Delivered":
        return "Доставлен"
      default:
        return status
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default"
      case "Dispatched":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="История заказов" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ваши заказы</h1>

        {orders.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="mb-4">У вас пока нет заказов</p>
            <Link href="/">
              <Button>Начать покупки</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold">Заказ №{order.id}</h2>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex-shrink-0">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-600">Итого:</span>
                    <span className="font-bold ml-2">${order.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">
                      {order.deliveryType === "DELIVERY" ? "Доставка" : "Самовывоз"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReorder(order)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Повторить заказ
                  </Button>
                  <Link href={`/orders/${order.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Подробности
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

