import { Card, CardContent } from '@/components/ui/card'

export function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-3 mb-6">
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex gap-8">
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="w-full h-[600px] bg-gray-200 animate-pulse" />
              <div className="p-10 md:p-16">
                <div className="h-12 bg-gray-200 rounded mb-6 w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded mb-8 w-1/4 animate-pulse" />
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>
              </div>
            </div>
          </article>
          <aside className="w-80 shrink-0 hidden lg:block">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 animate-pulse" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded shrink-0 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

