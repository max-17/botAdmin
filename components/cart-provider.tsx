"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  getCart,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "@/lib/data-service"

type CartContextType = {
  cartItems: { productId: string; quantity: number }[]
  cartCount: number
  addToCart: (productId: string, quantity?: number) => void
  updateCartItem: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([])

  useEffect(() => {
    // Initialize cart from localStorage
    setCartItems(getCart())

    // Setup event listener for cart updates from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        setCartItems(JSON.parse(e.newValue || "[]"))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (productId: string, quantity = 1) => {
    addToCartService(productId, quantity)
    setCartItems(getCart())
  }

  const updateCartItem = (productId: string, quantity: number) => {
    updateCartItemService(productId, quantity)
    setCartItems(getCart())
  }

  const removeFromCart = (productId: string) => {
    removeFromCartService(productId)
    setCartItems(getCart())
  }

  const clearCart = () => {
    clearCartService()
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

