import { Card, CardContent } from '@/components/ui/card'

export function AccommodationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Image Gallery Skeleton */}
        <div className="container mx-auto h-[500px] mb-8 overflow-hidden">
          <div className="flex gap-1 h-full">
            <div className="w-1/2 h-full bg-gray-200 animate-pulse" />
            <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full h-full bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content Skeleton */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-8">
              <div className="h-12 bg-gray-200 rounded mb-4 w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded mb-6 w-1/2 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded mb-4 w-24 animate-pulse" />
              
              <div className="space-y-4 mt-8">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar Skeleton */}
          <aside className="w-80 shrink-0 hidden lg:block">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-4 w-32 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

