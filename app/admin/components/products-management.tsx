"use client"

import React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import { formatPrice } from "@/lib/data-service"
import { useProducts, useCategories, useDeleteProduct, useCreateProduct, useUpdateProduct } from "@/lib/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

export default function ProductsManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get dialog states from URL
  const dialog = searchParams.get("dialog")
  const productId = searchParams.get("productId")

  // Use TanStack Query hooks
  const { data: products = [], isLoading: isLoadingProducts } = useProducts()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories()
  const deleteProductMutation = useDeleteProduct()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()

  // Form handling with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "/placeholder.svg?height=200&width=200",
      categoryId: "",
    },
  })

  // Set form values when editing a product
  React.useEffect(() => {
    if (dialog === "product" && productId) {
      const product = products.find((p) => p.id === Number(productId))
      if (product) {
        reset({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          imageUrl: product.imageUrl || "/placeholder.svg?height=200&width=200",
          categoryId: product.categoryId?.toString() || "",
        })
      }
    } else if (dialog === "product") {
      // New product - reset form
      reset({
        name: "",
        description: "",
        price: "",
        imageUrl: "/placeholder.svg?height=200&width=200",
        categoryId: categories.length > 0 ? categories[0].id.toString() : "",
      })
    }
  }, [dialog, productId, products, categories, reset])

  // URL manipulation functions
  const setSearchParams = (params: Record<string, string>) => {
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value)
      } else {
        url.searchParams.delete(key)
      }
    })
    router.push(url.search)
  }

  const openNewProductDialog = () => {
    setSearchParams({ dialog: "product", productId: "" })
  }

  const openEditProductDialog = (id: number) => {
    setSearchParams({ dialog: "product", productId: id.toString() })
  }

  const openDeleteDialog = (id: number) => {
    setSearchParams({ dialog: "delete", productId: id.toString() })
  }

  const closeDialog = () => {
    setSearchParams({ dialog: "", productId: "" })
  }

  // Form submission
  const onSubmit = (data: any) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: Number.parseFloat(data.price),
      imageUrl: data.imageUrl,
      categoryId: data.categoryId ? Number.parseInt(data.categoryId) : undefined,
    }

    if (productId) {
      updateProductMutation.mutate(
        {
          id: Number.parseInt(productId),
          product: productData,
        },
        {
          onSuccess: () => closeDialog(),
        },
      )
    } else {
      createProductMutation.mutate(productData, {
        onSuccess: () => closeDialog(),
      })
    }
  }

  // Delete product
  const confirmDeleteProduct = () => {
    if (productId) {
      deleteProductMutation.mutate(Number.parseInt(productId), {
        onSuccess: () => closeDialog(),
      })
    }
  }

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Товары</CardTitle>
            <CardDescription>Управление товарами</CardDescription>
          </div>
          <Button onClick={openNewProductDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Изображение</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
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
                  <TableCell>{categories.find((c) => c.id === product.categoryId)?.name || "Без категории"}</TableCell>
                  <TableCell className="text-right">${formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(product.id)}>
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

      {/* Product Dialog */}
      <Dialog open={dialog === "product"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{productId ? "Редактировать товар" : "Добавить новый товар"}</DialogTitle>
            <DialogDescription>
              {productId ? "Обновите детали товара ниже." : "Заполните детали товара ниже."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Название товара"
                  {...register("name", { required: "Название обязательно" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" placeholder="Описание товара" {...register("description")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Цена ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register("price", {
                    required: "Цена обязательна",
                    min: { value: 0.01, message: "Цена должна быть больше 0" },
                  })}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Категория</Label>
                <Select value={watch("categoryId")} onValueChange={(value) => setValue("categoryId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Отмена
              </Button>
              <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                {createProductMutation.isPending || updateProductMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct} disabled={deleteProductMutation.isPending}>
              {deleteProductMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

