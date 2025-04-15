"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPrice } from "@/lib/data-service"
import { useUsers, useOrders } from "@/lib/hooks"

export default function CustomersManagement() {
  const { data: users = [] } = useUsers()
  const { data: orders = [] } = useOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Клиенты</CardTitle>
        <CardDescription>Управление базой клиентов</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Заказы</TableHead>
              <TableHead>Общая сумма</TableHead>
              <TableHead>Последний заказ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const userOrders = orders.filter((order) => order.userId === user.id)
              const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)
              const lastOrder =
                userOrders.length > 0
                  ? userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                  : null

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{userOrders.length}</TableCell>
                  <TableCell>${formatPrice(totalSpent)}</TableCell>
                  <TableCell>{lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : "Н/Д"}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

