"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
  type OrderStatus,
  type Product,
} from "@/lib/data-service"

// Products
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function useProductsByCategory(categoryId: number) {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => {
      const products = getProducts()
      return products.filter((product) => product.categoryId === categoryId)
    },
    enabled: !!categoryId,
  })
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => {
      const categories = getCategories()
      return categories.find((category) => category.id === id)
    },
    enabled: !!id,
  })
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  })
}

// Users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

// Mutations
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] })
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">> }) =>
      updateProduct(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

