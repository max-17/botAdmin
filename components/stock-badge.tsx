import { Badge } from "@/components/ui/badge"

interface StockBadgeProps {
  status: string
}

export default function StockBadge({ status }: StockBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"
  let translatedStatus = status

  switch (status) {
    case "In Stock":
      variant = "default"
      translatedStatus = "В наличии"
      break
    case "Limited Stock":
      variant = "secondary"
      translatedStatus = "Ограниченное количество"
      break
    case "Out of Stock":
      variant = "destructive"
      translatedStatus = "Нет в наличии"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant} className="text-xs">
      {translatedStatus}
    </Badge>
  )
}

