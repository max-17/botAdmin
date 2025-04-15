"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/category-card";
import MobileHeader from "@/components/mobile-header";
import { getCategories } from "@/lib/data-service";
import { useCart } from "@/components/cart-provider";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { cartCount } = useCart();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  console.log(categories);

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Магазин стоматологических товаров" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Категории</h1>
          <Link href="/orders">
            <Button variant="outline" size="sm">
              заказы
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories &&
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
