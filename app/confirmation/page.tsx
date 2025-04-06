"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Clock, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import MobileHeader from "@/components/mobile-header"
import { getOrders } from "@/lib/data-service"
import type { Order } from "@/lib/data-service"

export default function ConfirmationPage() {
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
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Загрузка подтверждения заказа...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Подтверждение заказа" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
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
                {order.deliveryType === "DELIVERY" ? " 14:00 - 16:00" : " Самовывоз"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Статус заказа</h2>
              <p className="text-sm text-gray-600">
                {order.status === "Processing"
                  ? "Обработка"
                  : order.status === "Dispatched"
                    ? "Отправлен"
                    : "Доставлен"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Сводка заказа</h2>

          <div className="space-y-4 mb-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=100&width=100"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Кол-во: {item.quantity}</p>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Подытог</span>
              <span>${(order.total - 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка</span>
              <span>$5.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Итого</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {order.deliveryType === "DELIVERY" && (
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Информация о доставке</h2>

            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Адрес:</span>
                <p>
                  {order.address}, Квартира {order.apartment}, Подъезд {order.entrance}, Комната {order.room}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Получатель:</span>
                <p>{order.recipientName}</p>
              </div>
              <div>
                <span className="text-gray-600">Телефон:</span>
                <p>{order.recipientPhone}</p>
              </div>
            </div>
          </Card>
        )}

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
      </div>
    </main>
  )
}

