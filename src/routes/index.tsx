import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPostsFn } from '@/lib/posts/posts.server-functions'
import { getAllAccommodations } from '@/lib/accommodations/accommodation.server-functions'
import { formatPersianDate } from '@/lib/utils/date'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AccommodationCarousel } from '@/components/AccommodationCarousel'
import type { Post } from '@/lib/posts/posts.types'
import type { Accommodation } from '@/lib/accommodations/accommodation.types'
import { Plus, ArrowLeft } from 'lucide-react'
import { HomeSkeleton } from '@/components/HomeSkeleton'

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: HomeSkeleton,
  pendingMs: 0,
  loader: async () => {
    const [posts, accommodations] = await Promise.all([
      getAllPostsFn(),
      getAllAccommodations({ data: { pageSize: 20, pageNumber: 1 } }),
    ])
    // Format dates on server to avoid hydration mismatch
    const postsWithFormattedDates = posts.map((post) => ({
      ...post,
      formattedDate: formatPersianDate(post.createdAt),
    }))
    return { posts: postsWithFormattedDates, accommodations }
  },
})

function Home() {
  const { posts, accommodations } = Route.useLoaderData() as {
    posts: Post[]
    accommodations: Accommodation[]
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Accommodations Carousel Section */}
        {accommodations && accommodations.length > 0 && (
          <section className="mb-16">
            <AccommodationCarousel accommodations={accommodations} />
          </section>
        )}

        {/* Blog Posts Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 text-right">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                پست‌های وبلاگ
            </h1>
              <p className="text-gray-600">مطالب و داستان‌های جدید ما را کشف کنید</p>
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
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Plus size={40} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">هنوز پستی وجود ندارد</h2>
              <p className="text-gray-600 mb-6">سفر وبلاگ نویسی خود را با ایجاد اولین پست شروع کنید!</p>
              <Link to="/admin/new">
                <Button size="lg">اولین پست را بسازید</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post: Post) => (
                <Link key={post.id} to="/posts/$slug" params={{ slug: post.slug }}>
                  <Card className="h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col border-0 shadow-md hover:-translate-y-1">
                    {post.imageUrl && (
                      <div className="w-full h-56 overflow-hidden rounded-t-lg relative">
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
                      />
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          {(post as Post & { formattedDate?: string }).formattedDate}
                        </p>
                        <span className="text-xs text-blue-600 font-medium group-hover:translate-x-1 inline-block transition-transform">
                          ادامه مطلب ←
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/posts">
                <Button variant="outline" size="lg" className="shadow-md">
                  <ArrowLeft size={18} className="ml-2" />
                  نمایش همه پست‌ها
                </Button>
              </Link>
        </div>
          </>
        )}
      </section>
      </div>
    </div>
  )
}
