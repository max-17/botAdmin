"use client"

import { Suspense } from "react"
import OrdersList from "./orders-list"
import MobileHeader from "@/components/mobile-header"

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="История заказов" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ваши заказы</h1>

        <Suspense fallback={<p className="text-center py-10">Загрузка заказов...</p>}>
          <OrdersList />
        </Suspense>
      </div>
    </main>
  )
}

