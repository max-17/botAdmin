"use client"

import { Suspense } from "react"
import OrderConfirmation from "./order-confirmation"
import MobileHeader from "@/components/mobile-header"

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Подтверждение заказа" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <Suspense fallback={<p className="text-center py-10">Загрузка подтверждения заказа...</p>}>
          <OrderConfirmation />
        </Suspense>
      </div>
    </main>
  )
}

