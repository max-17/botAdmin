"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Phone, MapPin, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice, getStatusText } from "@/lib/utils";
import { useOrder, useUser, useUpdateOrderStatus } from "@/hooks/hooks";
import { OrderStatus } from "@prisma/client";
import { Label } from "@/components/ui/label";
export default function AdminOrderDetail({ orderId }: { orderId: number }) {
  const router = useRouter();
  const { data: order, isLoading } = useOrder(orderId);
  const { data: user } = useUser(order?.userId || 0);
  const updateOrderStatusMutation = useUpdateOrderStatus();

  if (isLoading) {
    return <p className="text-center py-10">Загрузка деталей заказа...</p>;
  }

  if (!order) {
    router.push("/admin");
    return null;
  }
  const selectedStatus = order.status as OrderStatus;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Информация о заказе</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm mb-auto text-gray-500">Статус:</span>
              <div className="mb-6">
                <RadioGroup
                  defaultValue={selectedStatus}
                  onValueChange={(value) => {
                    console.log(value);

                    handleStatusChange(value as OrderStatus);
                  }}
                  className="flex gap-0 bg-black/10 p-1.5 rounded-lg"
                >
                  {Object.keys(OrderStatus).map((status) => (
                    <Label
                      key={status}
                      htmlFor={`status-${status}`}
                      className={`min-w-fit items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-white [&:has([data-state=checked])]:text-white `}
                    >
                      {getStatusText(status as OrderStatus)}
                      <RadioGroupItem
                        value={status}
                        id={`status-${status}`}
                        className="sr-only"
                      />
                    </Label>
                  ))}
                </RadioGroup>
              </div>
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
              <div key={item.id} className="flex gap-3 border-b pb-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={"/placeholder.svg?height=100&width=100"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Цена: {formatPrice(item.product.price)}</p>
                    <p>Кол-во: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Доставка</span>
              <span>5.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Итого</span>
              <span>{formatPrice(order.total)}</span>
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
                <p>{user?.fullName || "Неизвестно"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <p>{user?.phone || "Неизвестно"}</p>
              </div>
            </div>
          </div>
        </Card>

        {order.delivery === "DELIVERY" && user?.address && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Информация о доставке
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Адрес</p>
                  <p>{user.address}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
