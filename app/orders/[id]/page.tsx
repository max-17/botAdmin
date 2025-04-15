"use client"

import { Suspense } from "react"
import MobileHeader from "@/components/mobile-header"
import OrderDetail from "./order-detail"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Детали заказа" backUrl="/orders" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <Suspense fallback={<p className="text-center py-10">Загрузка деталей заказа...</p>}>
          <OrderDetail orderId={Number.parseInt(params.id)} />
        </Suspense>
      </div>
    </main>
  )
}

