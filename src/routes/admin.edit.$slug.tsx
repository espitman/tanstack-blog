import { createFileRoute, useRouter, Link, notFound } from '@tanstack/react-router'
import { getPostBySlug, updatePost } from '@/lib/server-functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useCallback, useEffect } from 'react'

export const Route = createFileRoute('/admin/edit/$slug')({
  component: EditPost,
  loader: async ({ params }: { params: { slug: string } }) => {
    const post = await getPostBySlug({ data: params.slug })
    if (!post) {
      throw notFound()
    }
    return post
  },
})

function EditPost() {
  const router = useRouter()
  const post = Route.useLoaderData()
  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [content, setContent] = useState(post.content)
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setTitle(post.title)
    setSlug(post.slug)
    setContent(post.content)
    setImageUrl(post.imageUrl || '')
  }, [post])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !slug.trim() || !content.trim()) {
        return
      }

      setIsSubmitting(true)
      try {
        const updatedPost = await updatePost({
          data: {
            slug: post.slug,
            title,
            content,
            imageUrl: imageUrl.trim() || undefined,
            newSlug: slug !== post.slug ? slug : undefined,
          },
        })
        router.navigate({ to: '/posts/$slug', params: { slug: updatedPost.slug } })
      } catch (error) {
        console.error('Error updating post:', error)
        alert('به‌روزرسانی پست با خطا مواجه شد. لطفا دوباره تلاش کنید.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [title, slug, content, imageUrl, post.slug, router],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to={`/posts/${post.slug}`}>
          <Button variant="outline" className="mb-8">
            ← بازگشت به پست
          </Button>
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">ویرایش پست</CardTitle>
            <p className="text-muted-foreground mt-2">محتوای پست خود را به‌روزرسانی کنید</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان پست را وارد کنید"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">شناسه URL</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-first-post"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  شناسه مناسب برای URL (مثال: "my-first-post")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">آدرس تصویر</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  اختیاری: آدرس تصویر پست
                </p>
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">محتوای پست</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="محتوای پست خود را اینجا بنویسید..."
                  rows={12}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی پست'}
                </Button>
                <Link to={`/posts/${post.slug}`}>
                  <Button type="button" variant="outline">
                    انصراف
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

