import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { createPostFn } from '@/lib/posts/posts.server-functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useCallback } from 'react'

export const Route = createFileRoute('/admin/new')({
  component: NewPost,
})

function NewPost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !slug.trim() || !content.trim()) {
        return
      }

      setIsSubmitting(true)
      try {
        await createPostFn({ data: { title, slug, content, imageUrl: imageUrl.trim() || undefined } })
        router.navigate({ to: '/posts/$slug', params: { slug } })
      } catch (error) {
        console.error('Error creating post:', error)
        alert('ایجاد پست با خطا مواجه شد. لطفا دوباره تلاش کنید.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [title, slug, content, imageUrl, router],
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            ← بازگشت به پست‌ها
          </Button>
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">ایجاد پست جدید</CardTitle>
            <p className="text-muted-foreground mt-2">افکار خود را با جهان به اشتراک بگذارید</p>
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
                  {isSubmitting ? 'در حال ایجاد...' : 'ایجاد پست'}
                </Button>
                <Link to="/">
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

