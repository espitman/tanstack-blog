import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="space-y-2 text-right">
            <div className="h-12 w-64 bg-gray-200 rounded animate-pulse ml-auto" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse ml-auto" />
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full border-0 shadow-md overflow-hidden">
              <div className="w-full h-56 bg-gray-200 animate-pulse" />
              <CardHeader className="pb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse ml-auto" />
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

