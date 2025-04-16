"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  useProducts,
  useCategories,
  useDeleteProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/lib/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function ProductsManagement() {
  // State for dialog management
  const [dialogState, setDialogState] = useState({
    productDialog: false,
    deleteDialog: false,
    currentProductId: null as number | null,
  });

  // Use TanStack Query hooks
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const deleteProductMutation = useDeleteProduct();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

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
      subcategoryId: "",
    },
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState(
    "/placeholder.svg?height=200&width=200"
  );

  // Watch for selected category to filter subcategories
  const selectedCategoryId = watch("categoryId");

  // Get subcategories for the selected category
  const subcategories = selectedCategoryId
    ? categories.find((c) => c.id.toString() === selectedCategoryId)
        ?.subCategories || []
    : [];

  // Set form values when editing a product
  React.useEffect(() => {
    if (dialogState.productDialog && dialogState.currentProductId) {
      const product = products.find(
        (p) => p.id === dialogState.currentProductId
      );
      if (product) {
        reset({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(), // Convert from cents to dollars for display
          imageUrl: product.imageUrl || "/placeholder.svg?height=200&width=200",
          categoryId: product.category?.parentId?.toString() || "",
          subcategoryId: product.categoryId?.toString() || "",
        });
        setImagePreview(
          product.imageUrl || "/placeholder.svg?height=200&width=200"
        );
      }
    } else if (dialogState.productDialog) {
      // New product - reset form
      reset({
        name: "",
        description: "",
        price: "",
        imageUrl: "/placeholder.svg?height=200&width=200",
        categoryId: categories.length > 0 ? categories[0].id.toString() : "",
        subcategoryId: "",
      });
      setImagePreview("/placeholder.svg?height=200&width=200");
    }
  }, [
    dialogState.productDialog,
    dialogState.currentProductId,
    products,
    categories,
    reset,
  ]);

  // Dialog management functions
  const openNewProductDialog = () => {
    setDialogState({
      productDialog: true,
      deleteDialog: false,
      currentProductId: null,
    });
  };

  const openEditProductDialog = (id: number) => {
    setDialogState({
      productDialog: true,
      deleteDialog: false,
      currentProductId: id,
    });
  };

  const openDeleteDialog = (id: number) => {
    setDialogState({
      productDialog: false,
      deleteDialog: true,
      currentProductId: id,
    });
  };

  const closeDialog = () => {
    setDialogState({
      productDialog: false,
      deleteDialog: false,
      currentProductId: null,
    });
  };

  // Handle image URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue("imageUrl", url);
    setImagePreview(url);
  };

  // Form submission
  const onSubmit = (data: any) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: parseInt(data.price), // Convert to number
      imageUrl: data.imageUrl,
      category: data.subcategoryId
        ? {
            connect: {
              id: Number.parseInt(data.subcategoryId),
            },
          }
        : undefined,
    };

    if (dialogState.currentProductId) {
      updateProductMutation.mutate(
        {
          id: dialogState.currentProductId,
          updates: productData,
        },
        {
          onSuccess: () => closeDialog(),
        }
      );
    } else {
      createProductMutation.mutate(productData, {
        onSuccess: () => closeDialog(),
      });
    }
  };

  // Delete product
  const confirmDeleteProduct = () => {
    if (dialogState.currentProductId) {
      deleteProductMutation.mutate(dialogState.currentProductId, {
        onSuccess: () => closeDialog(),
      });
    }
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Загрузка...</div>;
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
                <TableHead>Подкатегория</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const category = categories.find(
                  (c) => c.id === product.category?.parentId
                );
                const subcategory = category?.subCategories?.find(
                  (s) => s.id === product.categoryId
                );

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-10 h-10">
                        <Image
                          src={
                            product.imageUrl ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{category?.name || "Без категории"}</TableCell>
                    <TableCell>{subcategory?.name || "—"}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditProductDialog(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog
        open={dialogState.productDialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {dialogState.currentProductId
                ? "Редактировать товар"
                : "Добавить новый товар"}
            </DialogTitle>
            <DialogDescription>
              {dialogState.currentProductId
                ? "Обновите детали товара ниже."
                : "Заполните детали товара ниже."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    placeholder="Название товара"
                    {...register("name", { required: "Название обязательно" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (y.e)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder=" 00"
                    step="1"
                    {...register("price", {
                      required: "Цена обязательна",
                      min: {
                        value: 1,
                        message: "Цена должна быть больше 0",
                      },
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Категория</Label>
                  <Select
                    value={watch("categoryId")}
                    onValueChange={(value) => {
                      setValue("categoryId", value);
                      setValue("subcategoryId", ""); // Reset subcategory when category changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategoryId">Подкатегория</Label>
                  <Select
                    value={watch("subcategoryId")}
                    onValueChange={(value) => setValue("subcategoryId", value)}
                    disabled={!selectedCategoryId || subcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите подкатегорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.id}
                          value={subcategory.id.toString()}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание товара"
                  {...register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Изображение</Label>
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Предпросмотр"
                      fill
                      className="object-cover"
                      onError={() =>
                        setImagePreview("/placeholder.svg?height=200&width=200")
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="imageUrl"
                      placeholder="URL изображения"
                      {...register("imageUrl")}
                      onChange={handleImageUrlChange}
                    />
                    <p className="text-xs text-gray-500">
                      Введите URL изображения или используйте заполнитель по
                      умолчанию
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending
                  ? "Сохранение..."
                  : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogState.deleteDialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие нельзя
              отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
