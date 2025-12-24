import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPostBySlugFn, getLatestPostsFn } from '@/lib/posts/posts.server-functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { formatPersianDate, formatPersianDateShort } from '@/lib/utils/date'
import { Edit2, ArrowLeft, Calendar } from 'lucide-react'
import type { Post } from '@/lib/posts/posts.types'

export const Route = createFileRoute('/posts/$slug')({
  component: PostDetail,
  loader: async ({ params }: { params: { slug: string } }) => {
    const [post, latestPosts] = await Promise.all([
      getPostBySlugFn({ data: params.slug }),
      getLatestPostsFn({ data: { excludeSlug: params.slug, limit: 5 } }),
    ])
    if (!post) {
      throw notFound()
    }
    // Format dates on server to avoid hydration mismatch
    const postWithFormattedDate = {
      ...post,
      formattedDate: formatPersianDate(post.createdAt),
    }
    const latestPostsWithFormattedDates = latestPosts.map((p) => ({
      ...p,
      formattedDate: formatPersianDateShort(p.createdAt),
    }))
    return { post: postWithFormattedDate, latestPosts: latestPostsWithFormattedDates }
  },
})

function PostDetail() {
  const { post, latestPosts } = Route.useLoaderData() as {
    post: Post
    latestPosts: Post[]
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
              <ArrowLeft size={16} className="ml-2" />
              بازگشت به پست‌ها
            </Button>
          </Link>
          <Link to="/admin/edit/$slug" params={{ slug: post.slug }}>
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
              <Edit2 size={16} className="ml-2" />
              ویرایش پست
            </Button>
          </Link>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {post.imageUrl && (
                <div className="w-full h-[600px] overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}
              
              <div className="px-8 md:px-12 lg:px-16 pt-10 pb-6">
                <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-gray-600 mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                    <Calendar size={18} className="text-blue-600" />
                <time className="text-sm font-medium">
                  {(post as Post & { formattedDate?: string }).formattedDate || formatPersianDate(post.createdAt)}
                </time>
                  </div>
                </div>
              </div>

              <div className="px-8 md:px-12 lg:px-16 pb-16">
                <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-blockquote:border-r-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg prose-blockquote:my-6 prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          {latestPosts.length > 0 && (
            <aside className="w-80 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">پست‌های اخیر</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestPosts.map((latestPost) => (
                      <Link
                        key={latestPost.id}
                        to="/posts/$slug"
                        params={{ slug: latestPost.slug }}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          {latestPost.imageUrl && (
                            <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden">
                              <img
                                src={latestPost.imageUrl}
                                alt={latestPost.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                              {latestPost.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {(latestPost as Post & { formattedDate?: string }).formattedDate || formatPersianDateShort(latestPost.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

