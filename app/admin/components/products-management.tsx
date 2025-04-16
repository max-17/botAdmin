"use client";

import React, { useState, useMemo } from "react";
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
import {
  Edit,
  Trash2,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

// Define sorting options
type SortField = "name" | "price";
type SortDirection = "asc" | "desc";

interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export default function ProductsManagement() {
  // State for dialog management
  const [dialogState, setDialogState] = useState({
    productDialog: false,
    deleteDialog: false,
    currentProductId: null as number | null,
  });

  // State for filters and sorting
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [filterSubcategoryId, setFilterSubcategoryId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "name",
    direction: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Get subcategories for the selected category (for the form)
  const formSubcategories = selectedCategoryId
    ? categories.find((c) => c.id.toString() === selectedCategoryId)
        ?.subCategories || []
    : [];

  // Get subcategories for the filter
  const filterSubcategories = filterCategoryId
    ? categories.find((c) => c.id.toString() === filterCategoryId)
        ?.subCategories || []
    : [];

  // Apply filters and sorting to products
  const filteredAndSortedProducts = useMemo(() => {
    // First apply filters
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (filterCategoryId) {
      result = result.filter(
        (product) => product.category?.parentId === Number(filterCategoryId)
      );

      // Filter by subcategory (only if category is selected)
      if (filterSubcategoryId) {
        result = result.filter(
          (product) => product.categoryId === Number(filterSubcategoryId)
        );
      }
    }

    // Then apply sorting
    result.sort((a, b) => {
      if (sortOption.field === "name") {
        return sortOption.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortOption.field === "price") {
        return sortOption.direction === "asc"
          ? a.price - b.price
          : b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [
    products,
    searchQuery,
    filterCategoryId,
    filterSubcategoryId,
    sortOption,
  ]);

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
          price: product.price.toString(),
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

  // Sorting functions
  const toggleSort = (field: SortField) => {
    if (sortOption.field === field) {
      // Toggle direction if same field
      setSortOption({
        field,
        direction: sortOption.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Set new field with default asc direction
      setSortOption({ field, direction: "asc" });
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortOption.field !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortOption.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCategoryId(null);
    setFilterSubcategoryId(null);
    setSearchQuery("");
  };

  // Form submission
  const onSubmit = (data: any) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: Number.parseInt(data.price),
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
      createProductMutation.mutate(
        {
          name: data.name,
          description: data.description,
          price: Number.parseInt(data.price),
          imageUrl: data.imageUrl,
          categoryId: data.subcategoryId,
        },
        {
          onSuccess: () => closeDialog(),
        }
      );
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
          {/* Search and Filter Controls */}
          <div className="mb-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск товаров..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={
                  !filterCategoryId && !filterSubcategoryId && !searchQuery
                }
              >
                Сбросить
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-md">
                <div className="w-64">
                  <Label htmlFor="filterCategory" className="text-sm">
                    Категория
                  </Label>
                  <Select
                    value={filterCategoryId || ""}
                    onValueChange={(value) => {
                      setFilterCategoryId(value || null);
                      setFilterSubcategoryId(null); // Reset subcategory when category changes
                    }}
                  >
                    <SelectTrigger id="filterCategory">
                      <SelectValue placeholder="Все категории" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
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

                <div className="w-64">
                  <Label htmlFor="filterSubcategory" className="text-sm">
                    Подкатегория
                  </Label>
                  <Select
                    value={filterSubcategoryId || ""}
                    onValueChange={(value) =>
                      setFilterSubcategoryId(value || null)
                    }
                    disabled={
                      !filterCategoryId || filterSubcategories.length === 0
                    }
                  >
                    <SelectTrigger id="filterSubcategory">
                      <SelectValue placeholder="Все подкатегории" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все подкатегории</SelectItem>
                      {filterSubcategories.map((subcategory) => (
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
            )}

            {/* Active filters display */}
            {(filterCategoryId || filterSubcategoryId || searchQuery) && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Поиск: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {filterCategoryId && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Категория:{" "}
                    {
                      categories.find(
                        (c) => c.id.toString() === filterCategoryId
                      )?.name
                    }
                    <button
                      onClick={() => {
                        setFilterCategoryId(null);
                        setFilterSubcategoryId(null);
                      }}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {filterSubcategoryId && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Подкатегория:{" "}
                    {
                      filterSubcategories.find(
                        (s) => s.id.toString() === filterSubcategoryId
                      )?.name
                    }
                    <button
                      onClick={() => setFilterSubcategoryId(null)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Изображение</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center font-semibold"
                      onClick={() => toggleSort("name")}
                    >
                      Название
                      {getSortIcon("name")}
                    </button>
                  </TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Подкатегория</TableHead>
                  <TableHead className="text-right">
                    <button
                      className="flex items-center font-semibold ml-auto"
                      onClick={() => toggleSort("price")}
                    >
                      Цена
                      {getSortIcon("price")}
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Товары не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedProducts.map((product) => {
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
                                "/placeholder.svg?height=40&width=40" ||
                                "/placeholder.svg"
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
                        <TableCell>
                          {category?.name || "Без категории"}
                        </TableCell>
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
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mt-2">
            Показано {filteredAndSortedProducts.length} из {products.length}{" "}
            товаров
          </div>
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
                    disabled={
                      !selectedCategoryId || formSubcategories.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите подкатегорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {formSubcategories.map((subcategory) => (
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
