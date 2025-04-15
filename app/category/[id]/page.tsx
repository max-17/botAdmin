"use client"

import { Suspense } from "react"
import CategoryProducts from "./category-products"
import MobileHeader from "@/components/mobile-header"

export default function CategoryPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Товары категории" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <Suspense fallback={<p className="text-center py-10">Загрузка товаров...</p>}>
          <CategoryProducts categoryId={Number.parseInt(params.id)} />
        </Suspense>
      </div>
    </main>
  )
}

