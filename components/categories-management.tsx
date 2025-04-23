"use client";

import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-category";
import { Category } from "@prisma/client";

export default function CategoriesManagement() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [categoryDialog, setCategoryDialog] = useState({
    open: false,
    isEdit: false,
    isSubcategory: false,
    parentId: null as number | null,
    currentId: null as number | null,
    name: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as number | null,
    name: "",
  });

  const openAddCategoryDialog = () => {
    setCategoryDialog({
      open: true,
      isEdit: false,
      isSubcategory: false,
      parentId: null,
      currentId: null,
      name: "",
    });
  };

  const openAddSubcategoryDialog = (parentId: number) => {
    setCategoryDialog({
      open: true,
      isEdit: false,
      isSubcategory: true,
      parentId,
      currentId: null,
      name: "",
    });
  };

  const openEditCategoryDialog = (category: Category) => {
    setCategoryDialog({
      open: true,
      isEdit: true,
      isSubcategory: !!category.parentId,
      parentId: category.parentId || null,
      currentId: category.id,
      name: category.name,
    });
  };

  const openDeleteCategoryDialog = (category: Category) => {
    setDeleteDialog({
      open: true,
      id: category.id,
      name: category.name,
    });
  };

  const handleSaveCategory = async () => {
    const { isEdit, currentId, name, parentId } = categoryDialog;

    if (isEdit) {
      // Update category or subcategory
      await updateCategoryMutation.mutateAsync({
        id: currentId!,
        updates: { name, parentId },
      });
    } else {
      // Create category or subcategory
      await createCategoryMutation.mutateAsync({
        name,
        parentId,
      });
    }

    setCategoryDialog({
      open: false,
      isEdit: false,
      isSubcategory: false,
      parentId: null,
      currentId: null,
      name: "",
    });
  };

  const handleDeleteCategory = async () => {
    await deleteCategoryMutation.mutateAsync(deleteDialog.id!);

    setDeleteDialog({
      open: false,
      id: null,
      name: "",
    });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Категории и подкатегории</CardTitle>
            <CardDescription>Управление категориями товаров</CardDescription>
          </div>
          <Button onClick={openAddCategoryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить категорию
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет категорий. Создайте первую категорию, нажав кнопку "Добавить
              категорию".
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={`category-${category.id}`}
                >
                  <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">{category.name}</div>
                      <div
                        className="flex items-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          className="p-2"
                          onClick={() => openEditCategoryDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </a>
                        <a
                          className="p-2"
                          onClick={() => openDeleteCategoryDialog(category)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </a>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6">
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Подкатегории</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddSubcategoryDialog(category.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Добавить подкатегорию
                        </Button>
                      </div>

                      {category.subCategories &&
                      category.subCategories.length > 0 ? (
                        <div className="space-y-2 mt-2">
                          {category.subCategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                            >
                              <span className="text-sm">
                                {subcategory.name}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    openEditCategoryDialog(subcategory)
                                  }
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    openDeleteCategoryDialog(subcategory)
                                  }
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground py-2">
                          Нет подкатегорий
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog({ ...categoryDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {categoryDialog.isEdit
                ? "Редактировать категорию"
                : "Добавить категорию"}
            </DialogTitle>
            <DialogDescription>
              {categoryDialog.isEdit
                ? "Измените информацию о категории"
                : "Заполните информацию для новой категории"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Название категории</Label>
              <Input
                id="category-name"
                value={categoryDialog.name}
                onChange={(e) =>
                  setCategoryDialog({ ...categoryDialog, name: e.target.value })
                }
                placeholder="Введите название категории"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setCategoryDialog({ ...categoryDialog, open: false })
              }
            >
              Отмена
            </Button>
            <Button onClick={handleSaveCategory}>
              {categoryDialog.isEdit ? "Сохранить изменения" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить категорию</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить категорию "{deleteDialog.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
