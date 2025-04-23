import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/data-service";
import { db } from "@/lib/db";
import { Category } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Добавляем новые хуки для работы с категориями
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: { name: string; parentId: number | null }) =>
      createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<Category, "id">>;
    }) => updateCategory(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error): string => "error",
  });
}
