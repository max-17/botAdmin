"use client";

import { Box, Package, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { useProducts, useUsers } from "@/hooks/hooks";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/data-service";
import { formatPrice, getStatusBadgeVariant, getStatusText } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getDashboardData } from "@/app/server/actions";
import { Product } from "@prisma/client";

type DashboardData = {
  revenueDifferencePercent: number | string;
  thisMonthRevenue: number;
  ordersThisMonth: number;
  ordersToday: number;
  ordersYesterday: number;
  products: number;
  users: number;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  useEffect(() => {
    async function fetchDashboardData() {
      const data = await getDashboardData();
      return setDashboardData(data);
    }
    fetchDashboardData();
  }, []);

  const router = useRouter();
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders({ user: true }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: products = [] } = useProducts();

  // Calculate some summary data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrdersCount = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              общий доход месяца
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.revenueDifferencePercent}% с прошлого месяца
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые заказы</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.ordersToday} со вчерашнего дня
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Всего товаров</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.users || 0}
            </div>
            <p className="text-xs text-muted-foreground">Активных клиентов</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние заказы</CardTitle>
          <CardDescription>
            У вас {newOrdersCount} новых заказов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID заказа</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                {/* <TableHead className="w-[80px]">Действия</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => {
                return (
                  <TableRow
                    onClick={() => {
                      router.push(`/admin/orders/${order.id}`);
                    }}
                    key={order.id}
                  >
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.user?.name || "Неизвестно"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.total)}
                    </TableCell>
                    {/* <TableCell>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          Детали
                        </Button>
                      </Link>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
