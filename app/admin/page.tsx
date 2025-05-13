"use client";

import { useSearchParams } from "next/navigation";
import { Package, Search, Settings } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import admin components
import Dashboard from "./components/dashboard";
import OrdersManagement from "./components/orders-management";
import ProductsManagement from "./components/products-management";
import CustomersManagement from "./components/customers-management";
import CategoriesManagement from "@/components/categories-management";

export default function AdminPage() {
  const searchParams = useSearchParams();

  // Get active tab from URL or default to 'overview'
  const activeTab = searchParams.get("tab") || "overview";

  // Create URL for each tab
  const createTabUrl = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Админ-панель стоматологических товаров</span>
        </Link>
        <Button className="ml-auto" variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Настройки</span>
        </Button>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40 hidden md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href={createTabUrl("overview")}
              replace={true}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "overview"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              } transition-all hover:text-foreground`}
            >
              <span>Панель управления</span>
            </Link>
            <Link
              href={createTabUrl("orders")}
              replace={true}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "orders"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              } transition-all hover:text-foreground`}
            >
              <span>Заказы</span>
            </Link>
            <Link
              href={createTabUrl("products")}
              replace={true}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "products"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              } transition-all hover:text-foreground`}
            >
              <span>Товары</span>
            </Link>
            <Link
              href={createTabUrl("customers")}
              replace={true}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "customers"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              } transition-all hover:text-foreground`}
            >
              <span>Клиенты</span>
            </Link>
            <Link
              href={createTabUrl("categories")}
              replace={true}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "categories"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              } transition-all hover:text-foreground`}
            >
              <span>Категории</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              // This is just for the mobile tabs, we'll use Link with replace for the actual navigation
              window.location.replace(`/admin?tab=${value}`);
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <TabsList className="md:hidden">
                <TabsTrigger value="overview">Панель</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="products">Товары</TabsTrigger>
                <TabsTrigger value="customers">Клиенты</TabsTrigger>
                <TabsTrigger value="categories">Категории</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <Dashboard />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManagement />
            </TabsContent>

            <TabsContent value="products">
              <ProductsManagement />
            </TabsContent>

            <TabsContent value="customers">
              <CustomersManagement />
            </TabsContent>
            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
