import { Card, CardContent } from '@/components/ui/card'

export function AccommodationCardSkeleton() {
  return (
    <Card className="h-full border-0 shadow-md overflow-hidden">
      <div className="relative w-full h-56 bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="pt-4 border-t">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

