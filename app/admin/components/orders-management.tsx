"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useOrders, useUsers } from "@/lib/hooks";

export default function OrdersManagement() {
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Ожидает обработки";
      case "PROCESSING":
        return "Обработка";
      case "SHIPPED":
        return "Отправлен";
      case "DELIVERED":
        return "Доставлен";
      case "CANCELLED":
        return "Отменен";
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "SHIPPED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

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
              <TableHead className="w-[80px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const user = users.find((u) => u.id === order.userId);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{user?.fullName || "Неизвестно"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="text-right">
                    ${formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
