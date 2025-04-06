// Define types for our data model
export interface Category {
  id: string
  name: string
  icon: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  stockStatus: "In Stock" | "Limited Stock" | "Out of Stock"
  categoryId: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  status: "Processing" | "Dispatched" | "Delivered"
  total: number
  items: OrderItem[]
  deliveryType: "DELIVERY" | "PICKUP"
  deliveryAt: string
  createdAt: string
  address?: string
  apartment?: string
  entrance?: string
  room?: string
  recipientName: string
  recipientPhone: string
}

export interface Customer {
  id: string
  name: string
  phone: string
}

// Initial data
const initialCategories: Category[] = [
  { id: "1", name: "Стоматологические инструменты", icon: "🦷" },
  { id: "2", name: "Реставрационные материалы", icon: "🛠️" },
  { id: "3", name: "Эндодонтические материалы", icon: "🪥" },
  { id: "4", name: "Стерилизация и дезинфекция", icon: "🧴" },
]

const initialProducts: Product[] = [
  {
    id: "101",
    name: "Стоматологическое зеркало",
    description: "Высококачественное стоматологическое зеркало из нержавеющей стали для осмотра.",
    price: 5.0,
    imageUrl: "/placeholder.svg?height=200&width=200",
    stockStatus: "In Stock",
    categoryId: "1",
  },
  {
    id: "102",
    name: "Композитный пломбировочный материал",
    description: "Светоотверждаемая композитная смола для реставрации зубов.",
    price: 45.0,
    imageUrl: "/placeholder.svg?height=200&width=200",
    stockStatus: "Limited Stock",
    categoryId: "2",
  },
  {
    id: "103",
    name: "Файлы для корневых каналов",
    description: "Файлы из нержавеющей стали для эндодонтического лечения.",
    price: 15.0,
    imageUrl: "/placeholder.svg?height=200&width=200",
    stockStatus: "Out of Stock",
    categoryId: "3",
  },
  {
    id: "104",
    name: "Автоклав-стерилизатор",
    description: "Стерилизатор высокой емкости для стоматологических инструментов.",
    price: 500.0,
    imageUrl: "/placeholder.svg?height=200&width=200",
    stockStatus: "In Stock",
    categoryId: "4",
  },
]

const initialOrders: Order[] = [
  {
    id: "001",
    status: "Processing",
    total: 50.0,
    items: [
      {
        productId: "101",
        name: "Стоматологическое зеркало",
        quantity: 2,
        price: 5.0,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        productId: "102",
        name: "Композитный пломбировочный материал",
        quantity: 1,
        price: 40.0,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    deliveryType: "DELIVERY",
    deliveryAt: "2025-04-05T14:00:00Z",
    createdAt: "2025-04-01T10:30:00Z",
    recipientName: "Др. Иван Петров",
    recipientPhone: "+998901234567",
    address: "ул. Пушкина, 25",
    apartment: "3",
    entrance: "1",
    room: "6",
  },
  {
    id: "002",
    status: "Dispatched",
    total: 500.0,
    items: [
      {
        productId: "104",
        name: "Автоклав-��терилизатор",
        quantity: 1,
        price: 500.0,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    deliveryType: "PICKUP",
    deliveryAt: "2025-04-03T16:00:00Z",
    createdAt: "2025-04-01T11:45:00Z",
    recipientName: "Др. Иван Петров",
    recipientPhone: "+998901234567",
  },
  {
    id: "003",
    status: "Delivered",
    total: 15.0,
    items: [
      {
        productId: "103",
        name: "Файлы для корневых каналов",
        quantity: 1,
        price: 15.0,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    deliveryType: "DELIVERY",
    deliveryAt: "2025-03-30T09:00:00Z",
    createdAt: "2025-03-28T08:20:00Z",
    recipientName: "Др. Иван Петров",
    recipientPhone: "+998901234567",
    address: "ул. Пушкина, 25",
    apartment: "3",
    entrance: "1",
    room: "6",
  },
]

const initialCustomers: Customer[] = [
  {
    id: "201",
    name: "Др. Иван Петров",
    phone: "+998901234567",
  },
]

// Helper function to initialize localStorage
function initializeLocalStorage() {
  if (typeof window !== "undefined") {
    // Check if localStorage is already initialized
    if (!localStorage.getItem("initialized")) {
      localStorage.setItem("categories", JSON.stringify(initialCategories))
      localStorage.setItem("products", JSON.stringify(initialProducts))
      localStorage.setItem("orders", JSON.stringify(initialOrders))
      localStorage.setItem("customers", JSON.stringify(initialCustomers))
      localStorage.setItem("cart", JSON.stringify([]))
      localStorage.setItem("initialized", "true")
    }
  }
}

// Data service functions
export function getCategories(): Category[] {
  initializeLocalStorage()
  if (typeof window !== "undefined") {
    const categories = localStorage.getItem("categories")
    return categories ? JSON.parse(categories) : []
  }
  return []
}

export function getProducts(): Product[] {
  initializeLocalStorage()
  if (typeof window !== "undefined") {
    const products = localStorage.getItem("products")
    return products ? JSON.parse(products) : []
  }
  return []
}

export function getProductsByCategory(categoryId: string): Product[] {
  const products = getProducts()
  return products.filter((product) => product.categoryId === categoryId)
}

export function getProduct(id: string): Product | undefined {
  const products = getProducts()
  return products.find((product) => product.id === id)
}

export function getCart(): CartItem[] {
  initializeLocalStorage()
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  }
  return []
}

export function getCartWithDetails(): {
  items: (CartItem & { product: Product })[]
  subtotal: number
} {
  const cartItems = getCart()
  const products = getProducts()

  const items = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    return {
      ...item,
      product,
    }
  })

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  return { items, subtotal }
}

export function addToCart(productId: string, quantity = 1) {
  if (typeof window === "undefined") return

  const cart = getCart()
  const existingItem = cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
}

export function updateCartItem(productId: string, quantity: number) {
  if (typeof window === "undefined") return

  const cart = getCart()
  const updatedCart = cart.map((item) => (item.productId === productId ? { ...item, quantity } : item))

  localStorage.setItem("cart", JSON.stringify(updatedCart))
}

export function removeFromCart(productId: string) {
  if (typeof window === "undefined") return

  const cart = getCart()
  const updatedCart = cart.filter((item) => item.productId !== productId)

  localStorage.setItem("cart", JSON.stringify(updatedCart))
}

export function clearCart() {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify([]))
}

export function getOrders(): Order[] {
  initializeLocalStorage()
  if (typeof window !== "undefined") {
    const orders = localStorage.getItem("orders")
    return orders ? JSON.parse(orders) : []
  }
  return []
}

export function getOrder(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === id)
}

export function createOrder(order: Omit<Order, "id" | "createdAt">): Order {
  if (typeof window === "undefined") return {} as Order

  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: `${orders.length + 1}`.padStart(3, "0"),
    createdAt: new Date().toISOString(),
  }

  orders.push(newOrder)
  localStorage.setItem("orders", JSON.stringify(orders))

  // Clear cart after order is created
  clearCart()

  return newOrder
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  if (typeof window === "undefined") return

  const orders = getOrders()
  const updatedOrders = orders.map((order) => (order.id === id ? { ...order, status } : order))

  localStorage.setItem("orders", JSON.stringify(updatedOrders))
}

export function getCustomers(): Customer[] {
  initializeLocalStorage()
  if (typeof window !== "undefined") {
    const customers = localStorage.getItem("customers")
    return customers ? JSON.parse(customers) : []
  }
  return []
}

export function createProduct(product: Omit<Product, "id">): Product {
  if (typeof window === "undefined") return {} as Product

  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: `${Math.floor(Math.random() * 1000)}`,
  }

  products.push(newProduct)
  localStorage.setItem("products", JSON.stringify(products))

  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>) {
  if (typeof window === "undefined") return

  const products = getProducts()
  const updatedProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))

  localStorage.setItem("products", JSON.stringify(updatedProducts))
}

export function deleteProduct(id: string) {
  if (typeof window === "undefined") return

  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== id)

  localStorage.setItem("products", JSON.stringify(updatedProducts))
}

