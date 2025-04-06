"use client"

import { useState, useEffect } from "react"
import { Package, Search, Settings } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  getProducts,
  getOrders,
  getCustomers,
  getCategories,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  type Category,
  type Product,
  type Order,
  type Customer,
} from "@/lib/data-service"

// Import admin components
import Dashboard from "./components/dashboard"
import OrdersManagement from "./components/orders-management"
import ProductsManagement from "./components/products-management"
import CustomersManagement from "./components/customers-management"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Product dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // Order status dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [newOrderStatus, setNewOrderStatus] = useState<"Processing" | "Dispatched" | "Delivered">("Processing")

  // Form values for new product
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productImage, setProductImage] = useState("/placeholder.svg?height=200&width=200")
  const [productCategory, setProductCategory] = useState("")
  const [productStock, setProductStock] = useState<"In Stock" | "Limited Stock" | "Out of Stock">("In Stock")

  useEffect(() => {
    // Fetch data
    setProducts(getProducts())
    setOrders(getOrders())
    setCustomers(getCustomers())
    setCategories(getCategories())
  }, [])

  // Handle product dialog
  const openNewProductDialog = () => {
    setEditingProduct(null)
    setProductName("")
    setProductDescription("")
    setProductPrice("")
    setProductImage("/placeholder.svg?height=200&width=200")
    setProductCategory(categories[0]?.id || "")
    setProductStock("In Stock")
    setIsProductDialogOpen(true)
  }

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product)
    setProductName(product.name)
    setProductDescription(product.description)
    setProductPrice(product.price.toString())
    setProductImage(product.imageUrl)
    setProductCategory(product.categoryId)
    setProductStock(product.stockStatus)
    setIsProductDialogOpen(true)
  }

  const saveProduct = () => {
    if (editingProduct) {
      // Update existing product
      updateProduct(editingProduct.id, {
        name: productName,
        description: productDescription,
        price: Number.parseFloat(productPrice),
        imageUrl: productImage,
        categoryId: productCategory,
        stockStatus: productStock,
      })
    } else {
      // Create new product
      createProduct({
        name: productName,
        description: productDescription,
        price: Number.parseFloat(productPrice),
        imageUrl: productImage,
        categoryId: productCategory,
        stockStatus: productStock,
      })
    }

    // Close dialog and refresh products list
    setIsProductDialogOpen(false)
    setProducts(getProducts())
  }

  // Handle delete product dialog
  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete)
      setProducts(getProducts())
      setIsDeleteDialogOpen(false)
    }
  }

  // Handle order status update
  const openStatusDialog = (orderId: string, currentStatus: Order["status"]) => {
    setEditingOrderId(orderId)
    setNewOrderStatus(currentStatus)
    setIsStatusDialogOpen(true)
  }

  const updateStatus = () => {
    if (editingOrderId) {
      updateOrderStatus(editingOrderId, newOrderStatus)
      setOrders(getOrders())
      setIsStatusDialogOpen(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Админ-панель стоматологических товаров</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Поиск..." className="w-64 pl-8" />
          </form>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Настройки</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40 hidden md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Button
              variant="outline"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "overview" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-all hover:text-foreground`}
              onClick={() => setActiveTab("overview")}
            >
              <span>Панель управления</span>
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "orders" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-all hover:text-foreground`}
              onClick={() => setActiveTab("orders")}
            >
              <span>Заказы</span>
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "products" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-all hover:text-foreground`}
              onClick={() => setActiveTab("products")}
            >
              <span>Товары</span>
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "customers" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-all hover:text-foreground`}
              onClick={() => setActiveTab("customers")}
            >
              <span>Клиенты</span>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="md:hidden">
                <TabsTrigger value="overview">Панель</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="products">Товары</TabsTrigger>
                <TabsTrigger value="customers">Клиенты</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <Dashboard
                orders={orders}
                products={products}
                customers={customers}
                onEditOrderStatus={openStatusDialog}
              />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManagement orders={orders} onEditOrderStatus={openStatusDialog} />
            </TabsContent>

            <TabsContent value="products">
              <ProductsManagement
                products={products}
                categories={categories}
                onAddProduct={openNewProductDialog}
                onEditProduct={openEditProductDialog}
                onDeleteProduct={openDeleteDialog}
              />
            </TabsContent>

            <TabsContent value="customers">
              <CustomersManagement customers={customers} orders={orders} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Редактировать товар" : "Добави��ь новый товар"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Обновите детали товара ниже." : "Заполните детали товара ниже."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Название товара"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Описание товара"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Цена ($)</Label>
              <Input
                id="price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Категория</Label>
              <Select value={productCategory} onValueChange={setProductCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Статус наличия</Label>
              <Select value={productStock} onValueChange={(val) => setProductStock(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус наличия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">В наличии</SelectItem>
                  <SelectItem value="Limited Stock">Ограниченное количество</SelectItem>
                  <SelectItem value="Out of Stock">Нет в наличии</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={saveProduct}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Обновить статус заказа</DialogTitle>
            <DialogDescription>Изменить статус этого заказа.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="status">Статус</Label>
            <Select value={newOrderStatus} onValueChange={(val) => setNewOrderStatus(val as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Обработка</SelectItem>
                <SelectItem value="Dispatched">Отправлен</SelectItem>
                <SelectItem value="Delivered">Доставлен</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={updateStatus}>Обновить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

