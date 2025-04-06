"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Product, Category } from "@/lib/data-service"

interface ProductsManagementProps {
  products: Product[]
  categories: Category[]
  onAddProduct: () => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
}

export default function ProductsManagement({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsManagementProps) {
  const getStockStatusText = (status: string) => {
    switch (status) {
      case "In Stock":
        return "В наличии"
      case "Limited Stock":
        return "Ограниченное количество"
      case "Out of Stock":
        return "Нет в наличии"
      default:
        return status
    }
  }

  const getStockStatusVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "outline"
      case "Limited Stock":
        return "secondary"
      case "Out of Stock":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Товары</CardTitle>
          <CardDescription>Управление товарами</CardDescription>
        </div>
        <Button onClick={onAddProduct}>Добавить товар</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Наличие</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{categories.find((c) => c.id === product.categoryId)?.name || "Неизвестно"}</TableCell>
                <TableCell>
                  <Badge variant={getStockStatusVariant(product.stockStatus)}>
                    {getStockStatusText(product.stockStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
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

