"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import MobileHeader from "@/components/mobile-header"
import { getCartWithDetails, createOrder } from "@/lib/data-service"
import type { OrderItem } from "@/lib/data-service"

export default function CheckoutPage() {
  const router = useRouter()
  const [deliveryType, setDeliveryType] = useState("DELIVERY")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("9-11")
  const [fullName, setFullName] = useState("Др. Иван Петров")
  const [phone, setPhone] = useState("+998901234567")
  const [address, setAddress] = useState("ул. Пушкина, 25")
  const [apartment, setApartment] = useState("3")
  const [entrance, setEntrance] = useState("1")
  const [room, setRoom] = useState("6")
  const [cartDetails, setCartDetails] = useState({ items: [], subtotal: 0 })

  useEffect(() => {
    setCartDetails(getCartWithDetails())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create delivery time string
    const deliveryTime = date ? `${format(date, "yyyy-MM-dd")}T${time.split("-")[0]}:00:00Z` : new Date().toISOString()

    // Create order items from cart
    const orderItems: OrderItem[] = cartDetails.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.imageUrl,
    }))

    // Create the order
    const order = createOrder({
      status: "Processing",
      total: cartDetails.subtotal + 5, // Adding delivery fee
      items: orderItems,
      deliveryType: deliveryType as "DELIVERY" | "PICKUP",
      deliveryAt: deliveryTime,
      recipientName: fullName,
      recipientPhone: phone,
      ...(deliveryType === "DELIVERY" ? { address, apartment, entrance, room } : {}),
    })

    // Redirect to confirmation page
    router.push("/confirmation")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Оформление заказа" backUrl="/cart" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Контактная информация</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">ФИО</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Способ доставки</h2>

            <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="delivery" />
                <Label htmlFor="delivery" className="flex-1">
                  Доставка по адресу
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PICKUP" id="pickup" />
                <Label htmlFor="pickup" className="flex-1">
                  Самовывоз из магазина
                </Label>
              </div>
            </RadioGroup>

            {deliveryType === "DELIVERY" && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required={deliveryType === "DELIVERY"}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" type="button">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apartment">Квартира</Label>
                    <Input id="apartment" value={apartment} onChange={(e) => setApartment(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="entrance">Подъезд</Label>
                    <Input id="entrance" value={entrance} onChange={(e) => setEntrance(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="room">Номер комнаты/дома</Label>
                  <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Время доставки</h2>

            <div className="space-y-4">
              <div>
                <Label>Дата</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Время</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-11">9:00 - 11:00</SelectItem>
                    <SelectItem value="11-13">11:00 - 13:00</SelectItem>
                    <SelectItem value="13-15">13:00 - 15:00</SelectItem>
                    <SelectItem value="15-17">15:00 - 17:00</SelectItem>
                    <SelectItem value="17-19">17:00 - 19:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Сводка заказа</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Подытог ({cartDetails.items.length} товаров)</span>
                <span>${cartDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка</span>
                <span>$5.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>${(cartDetails.subtotal + 5).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            Разместить заказ
          </Button>
        </form>
      </div>
    </main>
  )
}

