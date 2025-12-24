import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPostsPaginatedFn } from '@/lib/posts/posts.server-functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPersianDate } from '@/lib/utils/date'
import { BlogListSkeleton } from '@/components/BlogListSkeleton'
import { Plus, ChevronRight, ChevronLeft, Calendar } from 'lucide-react'
import type { Post } from '@/lib/posts/posts.types'

export const Route = createFileRoute('/posts/')({
  component: BlogList,
  pendingComponent: BlogListSkeleton,
  pendingMs: 0,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
    }
  },
  loader: async ({ search: searchParams }) => {
    const page = (searchParams as { page?: number })?.page || 1
    const pageSize = 9
    const { posts, totalCount } = await getAllPostsPaginatedFn({
      data: { page, pageSize },
    })

    // Format dates on server
    const postsWithFormattedDates = posts.map((post) => ({
      ...post,
      formattedDate: formatPersianDate(post.createdAt),
    }))

    return { 
      posts: postsWithFormattedDates, 
      totalCount, 
      page, 
      pageSize 
    }
  },
})

function BlogList() {
  const { posts, totalCount, page: loaderPage, pageSize } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  const page = search.page || loaderPage || 1
  const totalPages = Math.ceil(totalCount / pageSize)

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/posts',
      search: { page: newPage },
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 text-right">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              وبلاگ
            </h1>
            <p className="text-gray-600">تمامی مطالب و داستان‌های ما را کشف کنید</p>
          </div>
          <Link to="/admin/new">
            <Button size="lg" className="shadow-lg">
              <Plus size={18} className="ml-2" />
              پست جدید بسازید
            </Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">هنوز پستی وجود ندارد</h2>
            <Link to="/admin/new">
              <Button size="lg">اولین پست را بسازید</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post: Post & { formattedDate?: string }) => (
                <Link key={post.id} to="/posts/$slug" params={{ slug: post.slug }}>
                  <Card className="h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col border-0 shadow-md hover:-translate-y-1 overflow-hidden">
                    {post.imageUrl && (
                      <div className="w-full h-56 overflow-hidden relative">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <CardHeader className="pb-3 text-right">
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between text-right">
                      <div
                        className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        suppressHydrationWarning={true}
                      />
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar size={14} />
                          <time suppressHydrationWarning={true}>
                            {post.formattedDate}
                          </time>
                        </div>
                        <span className="text-xs text-blue-600 font-medium group-hover:translate-x-1 inline-block transition-transform">
                          ادامه مطلب ←
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronRight size={16} />
                  قبلی
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                      className="w-10"
                    >
                      {(i + 1).toLocaleString('fa-IR')}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-2"
                >
                  بعدی
                  <ChevronLeft size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
