import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { formatPersianDateShort } from '@/lib/utils/date'
import { ChevronRight, ChevronLeft, Calendar } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Post } from '@/lib/posts/posts.types'

interface PostsCarouselProps {
  posts: Post[]
}

export function PostsCarousel({ posts }: PostsCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(true)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container
    
    const absScrollLeft = Math.abs(scrollLeft)
    const isAtStart = absScrollLeft < 10
    const isAtEnd = absScrollLeft + clientWidth >= scrollWidth - 10
    
    setCanScrollRight(!isAtStart)
    setCanScrollLeft(!isAtEnd)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = 336
    const scrollAmount = cardWidth * 2

    if (direction === 'right') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
    
    setTimeout(checkScrollButtons, 300)
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [posts.length])

  if (posts.length === 0) return null

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">پست‌های اخیر</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="قبلی"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="بعدی"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            to="/posts/$slug"
            params={{ slug: post.slug }}
            className="shrink-0 w-80"
          >
            <Card className="h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1 overflow-hidden">
              {post.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <CardContent className="p-4 text-right">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div
                  className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t">
                  <Calendar size={14} />
                  <time>
                    {(post as Post & { formattedDate?: string }).formattedDate || formatPersianDateShort(post.createdAt)}
                  </time>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

