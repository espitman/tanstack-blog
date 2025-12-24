import { AccommodationCardSkeleton } from './AccommodationCardSkeleton'

export function AccommodationsListSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse ml-auto" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse ml-auto" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 15 }).map((_, index) => (
            <AccommodationCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

