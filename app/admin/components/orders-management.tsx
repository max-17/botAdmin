"use client"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"
import type { Order } from "@/lib/data-service"

interface OrdersManagementProps {
  orders: Order[]
  onEditOrderStatus: (orderId: string, status: Order["status"]) => void
}

export default function OrdersManagement({ orders, onEditOrderStatus }: OrdersManagementProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Заказы</CardTitle>
        <CardDescription>Управление заказами клиентов</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Товары</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="w-[120px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.recipientName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => onEditOrderStatus(order.id, order.status)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

