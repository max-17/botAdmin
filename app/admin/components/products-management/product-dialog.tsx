import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { getProducts } from "@/lib/data-service";
import ImageInput from "@/components/image-input";
import { uploadFiles } from "@/hooks/use-uploadthing";

type ProductDialogProps = {
  open: boolean;
  product?: Awaited<ReturnType<typeof getProducts>>[number] | null;
  closeDialog: () => void;
};

export default function ProductDialog({
  open,
  product,
  closeDialog,
}: ProductDialogProps) {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const formSubcategories = selectedCategoryId
    ? categories.find((c) => c.id.toString() === selectedCategoryId)
        ?.subCategories || []
    : [];

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
      imageUrl: "",
      categoryId: "",
      subcategoryId: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(
    async (data: {
      name: string;
      description: string;
      price: string;
      imageUrl: FileList | string;
      categoryId: string;
      subcategoryId: string;
    }) => {
      setIsLoading(true);

      try {
        // Step 1: Create/Update the product in the database without the image
        let productId: number | undefined;

        if (product?.id) {
          // Update existing product
          await updateProductMutation.mutateAsync({
            id: product.id,
            updates: {
              name: data.name,
              description: data.description,
              price: parseInt(data.price),
              categoryId: parseInt(data.subcategoryId),
            },
          });
          productId = product.id;
        } else {
          // Create new product
          const createdProduct = await createProductMutation.mutateAsync({
            name: data.name,
            price: parseInt(data.price),
            categoryId: parseInt(data.subcategoryId),
            description: data.description,
            imageUrl: null,
          });
          productId = createdProduct?.id;
        }

        // Step 2: If the product was successfully created/updated, upload the image
        if (data.imageUrl instanceof FileList && productId) {
          const uploadedImage = await uploadFiles("imageUploader", {
            files: [...data.imageUrl],
          });

          if (uploadedImage.length > 0) {
            const imageUrl = uploadedImage[0].ufsUrl;

            // Update the product's imageUrl field
            await updateProductMutation.mutateAsync({
              id: productId,
              updates: { imageUrl },
            });
          }
        }

        // Reset the form and close the dialog
        reset();
        closeDialog();
      } catch (error) {
        console.error("Error during product creation/update:", error);
        // Handle error (e.g., show a notification)
      } finally {
        setIsLoading(false);
      }
    }
  );

  // Set form values when editing a product
  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
        categoryId: product.category?.parentId?.toString() || "",
        subcategoryId: product.categoryId?.toString() || "",
      });

      // Update selectedCategoryId to match the product's category
      setSelectedCategoryId(product.category?.parentId?.toString() || null);
    }

    if (open && !product) {
      // New product - reset form
      reset({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "",
        subcategoryId: "",
      });

      // Reset selectedCategoryId
      setSelectedCategoryId(null);
    }
  }, [open, product, categories, reset]);

  return (
    // TODO: Check if closeDialog works correctly
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        closeDialog();
      }}
    >
      <DialogContent aria-describedby={undefined} className="sm:max-w-[550px]">
        <DialogTitle>
          {product ? "Редактировать товар" : "Добавить товар"}
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="Название товара"
                {...register("name", { required: "Название обязательно" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
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
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Категория</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(value) => {
                  setSelectedCategoryId(value);
                  setValue("categoryId", value);
                  setValue("subcategoryId", ""); // Reset subcategory when category changes
                }}
                {...register("categoryId", {
                  required: "Категория обязательна",
                })}
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
              {errors.categoryId && (
                <p className="text-red-500 text-sm">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategoryId">Подкатегория</Label>
              <Select
                value={watch("subcategoryId")}
                onValueChange={(value) => setValue("subcategoryId", value)}
                disabled={!selectedCategoryId || formSubcategories.length === 0}
                {...register("subcategoryId", {
                  required: "Подкатегория обязательна",
                })}
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
              {errors.subcategoryId && (
                <p className="text-red-500 text-sm">
                  {errors.subcategoryId.message}
                </p>
              )}
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
            {/* <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => <ImageUploader field={field} />}
                /> */}
            <ImageInput
              type="file"
              accept="image/*"
              id="imageUrl"
              placeholder="Изображение товара"
              previewValue={product?.imageUrl || undefined}
              {...register("imageUrl")}
            />

            <p className="text-xs text-gray-500">
              Hажмите «Загрузить изображение», чтобы изменить или добавить
              изображение
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset();
                closeDialog();
              }}
            >
              Отмена
            </Button>
            <Button
              className="disabled:bg-gray-500"
              type="submit"
              disabled={
                createProductMutation.isPending ||
                updateProductMutation.isPending ||
                isLoading
              }
            >
              {createProductMutation.isPending ||
              updateProductMutation.isPending ||
              isLoading
                ? "Сохранение..."
                : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
