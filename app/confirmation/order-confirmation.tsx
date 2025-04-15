"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Clock, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOrders, formatPrice } from "@/lib/data-service"
import type { Order } from "@/lib/data-service"

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Get the most recent order
    const orders = getOrders()
    if (orders.length > 0) {
      const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      setOrder(latestOrder)
    }
  }, [])

  if (!order) {
    return <p className="text-center py-10">Заказ не найден</p>
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

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Заказ подтвержден!</h1>
        <p className="text-gray-600">Ваш заказ №{order.id} успешно размещен</p>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Ожидаемая доставка</h2>
            <p className="text-sm text-gray-600">
              {new Date(order.deliveryAt).toLocaleDateString()},
              {order.delivery === "DELIVERY" ? " 14:00 - 16:00" : " Самовывоз"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Статус заказа</h2>
            <p className="text-sm text-gray-600">{getStatusText(order.status)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Сводка заказа</h2>

        <div className="space-y-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Кол-во: {item.quantity}</p>
                <p className="font-semibold">${formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Подытог</span>
            <span>${formatPrice(order.total - 500)}</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка</span>
            <span>${formatPrice(500)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Итого</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            Просмотр заказов
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full">Продолжить покупки</Button>
        </Link>
      </div>
    </>
  )
}

