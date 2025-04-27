"use client";
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
import { formatPrice, getStatusBadgeVariant, getStatusText } from "@/lib/utils";
import { useOrders, useUsers } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { Eye, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersManagement() {
  const router = useRouter();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const user = users.find((u) => u.id === order.userId);
              return (
                <TableRow
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  key={order.id}
                >
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{user?.name || "Неизвестно"}</TableCell>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
