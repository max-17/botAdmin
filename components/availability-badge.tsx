import { Badge } from "@/components/ui/badge"

interface AvailabilityBadgeProps {
  isAvailable?: boolean
}

export default function AvailabilityBadge({ isAvailable = true }: AvailabilityBadgeProps) {
  return (
    <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
      {isAvailable ? "В наличии" : "Нет в наличии"}
    </Badge>
  )
}

