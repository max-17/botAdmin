import { Suspense } from "react"
import AdminOrderDetail from "./admin-order-detail"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AdminOrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Детали заказа #{params.id}</h1>
      </div>

      <Suspense fallback={<p className="text-center py-10">Загрузка деталей заказа...</p>}>
        <AdminOrderDetail orderId={Number.parseInt(params.id)} />
      </Suspense>
    </div>
  )
}

