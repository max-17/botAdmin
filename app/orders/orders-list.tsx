"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/data-service"
import { useOrders } from "@/lib/hooks"
import { useCart } from "@/components/cart-provider"

export default function OrdersList() {
  const { data: orders = [], isLoading } = useOrders()
  const { addToCart } = useCart()
  const router = useRouter()

  if (isLoading) {
    return <p className="text-center py-10">Загрузка заказов...</p>
  }

  const handleReorder = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      // Add all items from the order to the cart
      order.items.forEach((item) => {
        addToCart(item.productId, item.quantity)
      })
      router.push("/cart")
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Ожидает обработки"
      case "PROCESSING":
        return "Обработка"
      case "SHIPPED":
        return "Отправлен"
      case "DELIVERED":
        return "Доставлен"
      case "CANCELLED":
        return "Отменен"
      default:
        return status
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default"
      case "SHIPPED":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="mb-4">У вас пока нет заказов</p>
        <Link href="/">
          <Button>Начать покупки</Button>
        </Link>
      </Card>
    )
  }

  return (
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
              <div key={item.id} className="flex-shrink-0">
                <div className="relative w-16 h-16">
                  <Image
                    src={"/placeholder.svg?height=100&width=100"}
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
              <span className="font-bold ml-2">${formatPrice(order.total)}</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">{order.delivery === "DELIVERY" ? "Доставка" : "Самовывоз"}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReorder(order.id)}>
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
  )
}

