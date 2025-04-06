import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  id: string
  name: string
  icon: string
}

export default function CategoryCard({ id, name, icon }: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-2">{icon}</span>
          <h2 className="font-medium">{name}</h2>
        </CardContent>
      </Card>
    </Link>
  )
}

