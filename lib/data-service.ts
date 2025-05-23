"use server";
import { OrderStatus } from "@prisma/client";
// import { formatPrice } from "./utils"; // Assuming you have a utility file for formatting prices
import type { Category, Product } from "@prisma/client";
import { db } from "./db";
// Categories
export async function getCategories() {
  return await db.category.findMany({
    where: { parentId: null },
    include: { subCategories: true },
  });
}
export async function getSubcategories(parentId: number) {
  return await db.category.findMany({ where: { parentId: parentId } });
}

export async function getCategory(id: number) {
  return await db.category.findUnique({
    where: { id },
    include: { subCategories: true },
  });
}

// Products
export async function getProducts() {
  return await db.product.findMany({
    include: { category: { include: { parent: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProductsByCategory(categoryId: number) {
  return await db.product.findMany({ where: { categoryId } });
}

export async function getProduct(id: number) {
  return await db.product.findUnique({ where: { id } });
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  try {
    const newProduct = await db.product.create({
      data: {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return newProduct;
  } catch {
    console.log("Creating product:", product);
  }
}

export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
) {
  return await db.product.update({
    where: { id },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  });
}

export async function deleteProduct(id: number) {
  return await db.product.delete({ where: { id } });
}

// Cart
export async function getCart(userId: number) {
  return await db.orderItem.findMany({
    where: { order: { userId, status: "PENDING" } },
  });
}

// export async function addToCart(
//   userId: number,
//   productId: number,
//   quantity = 1
// ) {
//   return await prisma.orderItem.upsert({
//     where: { order: { userId, status: "PENDING" }, productId },
//   });
// }

// export async function updateorderItem(
//   userId: number,
//   productId: number,
//   quantity: number
// ) {
//   return await prisma.orderItem.update({
//     where: { order: {userId}, productId  },
//     data: { quantity },
//   });
// }

// export async function removeFromCart(userId: number, productId: number) {
//   return await prisma.orderItem.delete({
//     where: { userId_productId: { userId, productId } },
//   });
// }

// export async function clearCart(userId: number) {
//   return await prisma.orderItem.deleteMany({ where: { userId } });
// }

// Orders
export async function getOrders(include?: { user?: boolean }) {
  return await db.order.findMany({
    include: { items: true, user: include?.user && { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOrder(id: number) {
  return await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

// export async function createOrder(orderData: {
//   userId: number;
//   items: Omit<OrderItem, "id" | "orderId">[];
//   delivery: DeliveryType;
//   deliveryAt: string;
//   total: number;
// }) {
//   const { userId, items, delivery, deliveryAt, total } = orderData;

//   const newOrder = await prisma.order.create({
//     data: {
//       userId,
//       delivery,
//       deliveryAt: new Date(deliveryAt),
//       total,
//       status: "PENDING",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       items: {
//         create: items.map((item) => ({
//           productId: item.productId,
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       },
//     },
//     include: { items: true },
//   });

//   // Clear cart after order is created
//   await clearCart(userId);

//   return newOrder;
// }

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return await db.order.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}

// Users
export async function getUsers() {
  return await db.user.findMany();
}

export async function getUser(id: number) {
  return await db.user.findUnique({ where: { id } });
}

// Categories and Subcategories
export async function createCategory(category: Omit<Category, "id">) {
  const newCategory = await db.category.create({
    data: category,
  });
  return newCategory;
}

export async function updateCategory(
  id: number,
  updates: Partial<Omit<Category, "id">>
) {
  return await db.category.update({
    where: { id },
    data: updates,
  });
}

export async function deleteCategory(id: number) {
  // Проверяем, есть ли товары в этой категории
  return await db.category.delete({ where: { id } });
}
