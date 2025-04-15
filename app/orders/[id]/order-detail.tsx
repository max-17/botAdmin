"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/data-service"
import { useOrder, useUser } from "@/lib/hooks"

export default function OrderDetail({ orderId }: { orderId: number }) {
  const router = useRouter()
  const { data: order, isLoading } = useOrder(orderId)
  const { data: user } = useUser(order?.userId || 0)

  if (isLoading) {
    return <p className="text-center py-10">Загрузка деталей заказа...</p>
  }

  if (!order) {
    router.push("/orders")
    return null
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Заказ №{order.id}</h1>
        <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Дата заказа</h2>
            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Ожидаемая доставка</h2>
            <p className="text-sm text-gray-600">
              {new Date(order.deliveryAt).toLocaleDateString()},
              {order.delivery === "DELIVERY" ? " 14:00 - 16:00" : " Самовывоз"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Товары</h2>

        <div className="space-y-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={"/placeholder.svg?height=100&width=100"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
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
            <span>$5.00</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Итого</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      {order.delivery === "DELIVERY" && user?.address && (
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Информация о доставке</h2>

          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Адрес:</span>
              <p>
                {user.address}, Квартира {user.apartment || "Н/Д"}, Подъезд {user.entrance || "Н/Д"}, Комната{" "}
                {user.room || "Н/Д"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Получатель:</span>
              <p>{user.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Телефон:</span>
              <p>{user.phone}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-4">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к заказам
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full">Продолжить покупки</Button>
        </Link>
      </div>
    </>
  )
}

