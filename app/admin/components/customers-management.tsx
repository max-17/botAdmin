"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer, Order } from "@/lib/data-service"

interface CustomersManagementProps {
  customers: Customer[]
  orders: Order[]
}

export default function CustomersManagement({ customers, orders }: CustomersManagementProps) {
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
            {customers.map((customer) => {
              const customerOrders = orders.filter((order) => order.recipientName === customer.name)
              const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)
              const lastOrder =
                customerOrders.length > 0
                  ? customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                  : null

              return (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customerOrders.length}</TableCell>
                  <TableCell>${totalSpent.toFixed(2)}</TableCell>
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

