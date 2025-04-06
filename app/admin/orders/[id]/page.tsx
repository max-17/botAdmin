"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrder, updateOrderStatus } from "@/lib/data-service"
import type { Order } from "@/lib/data-service"

export default function AdminOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<Order["status"]>("Processing")

  useEffect(() => {
    const fetchedOrder = getOrder(orderId)
    if (fetchedOrder) {
      setOrder(fetchedOrder)
      setStatus(fetchedOrder.status)
    } else {
      router.push("/admin")
    }
  }, [orderId, router])

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Загрузка деталей заказа...</p>
      </main>
    )
  }

  const handleStatusChange = (newStatus: Order["status"]) => {
    setStatus(newStatus)
    updateOrderStatus(order.id, newStatus)
    setOrder({ ...order, status: newStatus })
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
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Детали заказа #{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Информация о заказе</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Статус:</span>
                <Select value={status} onValueChange={(value) => handleStatusChange(value as Order["status"])}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      <Badge variant={getStatusBadgeVariant(status)}>{getStatusText(status)}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Обработка</SelectItem>
                    <SelectItem value="Dispatched">Отправлен</SelectItem>
                    <SelectItem value="Delivered">Доставлен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Дата заказа</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Время доставки</p>
                  <p>{new Date(order.deliveryAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Товары</h3>
            <div className="space-y-4 mb-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-3 border-b pb-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=100&width=100"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Цена: ${item.price.toFixed(2)}</p>
                      <p>Кол-во: {item.quantity}</p>
                    </div>
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
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Информация о клиенте</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Получатель</p>
                  <p>{order.recipientName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p>{order.recipientPhone}</p>
                </div>
              </div>
            </div>
          </Card>

          {order.deliveryType === "DELIVERY" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Информация о доставке</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p>{order.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Квартира</p>
                    <p>{order.apartment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Подъезд</p>
                    <p>{order.entrance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Комната</p>
                    <p>{order.room}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

