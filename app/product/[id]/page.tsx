import { Suspense } from "react"
import ProductDetail from "./product-detail"
import MobileHeader from "@/components/mobile-header"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Детали товара" backUrl="/" />

      <div className="container px-4 py-6 max-w-md mx-auto">
        <Suspense fallback={<p className="text-center py-10">Загрузка товара...</p>}>
          <ProductDetail productId={Number.parseInt(params.id)} />
        </Suspense>
      </div>
    </main>
  )
}

