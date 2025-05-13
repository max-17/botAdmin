"use client";

import type { OrderStatus, Product } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  getCategories,
  getOrders,
  getOrder,
  getUsers,
  getUser,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/data-service";

// Products
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useProductsByCategory(categoryId: number) {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const products = await getProducts();
      return products.filter((product) => product.categoryId === categoryId);
    },
    enabled: !!categoryId,
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const categories = await getCategories();
      return categories.find((category) => category.id === id);
    },
    enabled: !!id,
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

// Users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

// Mutations
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onMutate: async (updatedOrder) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["order", updatedOrder.id] });

      // Snapshot the previous value
      const previousState = queryClient.getQueryData([
        "order",
        updatedOrder.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["order", updatedOrder.id], (oldOrder: any) => {
        if (typeof oldOrder === "object" && oldOrder !== null) {
          return {
            ...oldOrder,
            ...updatedOrder,
          };
        }
        return updatedOrder;
      });

      // Return a context object with the snapshotted value
      return { previousState };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedOrder, context) => {
      queryClient.setQueryData(
        ["order", updatedOrder.id],
        context?.previousState
      );
    },
    // Always refetch after error or success:
    onSettled: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // invalidate ["order", order.id]
      if (updatedOrder?.id) {
        queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
      } else queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
    }) => updateProduct(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
