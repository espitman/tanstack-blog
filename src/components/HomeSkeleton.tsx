import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Carousel Skeleton */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 w-80 h-[400px] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </section>

        {/* Posts Section Skeleton */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div className="space-y-2">
              <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full border-0 shadow-md overflow-hidden">
                <div className="w-full h-56 bg-gray-200 animate-pulse" />
                <CardHeader className="pb-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

