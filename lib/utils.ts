import { OrderStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()} y.e`;
}

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "В корзине";
    case "PROCESSING":
      return "Обработка";
    case "CONFIRMED":
      return "Подтвержден";
    case "DELIVERED":
      return "Доставлен";
    case "CANCELED":
      return "Отменен";
    default:
      return status;
  }
};

export const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "CONFIRMED":
      return "default";
    case "PROCESSING":
      return "secondary";
    case "CANCELED":
      return "destructive";
    default:
      return "outline";
  }
};
