import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPostBySlug } from '@/lib/server-functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Edit2, ArrowLeft, Calendar } from 'lucide-react'

export const Route = createFileRoute('/posts/$slug')({
  component: PostDetail,
  loader: async ({ params }: { params: { slug: string } }) => {
    const post = await getPostBySlug({ data: params.slug })
    if (!post) {
      throw notFound()
    }
    return post
  },
})

function PostDetail() {
  const post = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="ml-2" />
              بازگشت به پست‌ها
            </Button>
          </Link>
          <Link to="/admin/edit/$slug" params={{ slug: post.slug }}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} className="ml-2" />
              ویرایش پست
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          {post.imageUrl && (
            <div className="w-full h-[500px] overflow-hidden relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            </div>
          )}
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={16} />
              <time className="text-sm">
                {new Date(post.createdAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-12">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}

