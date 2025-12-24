import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, ChevronLeft, Star, MapPin, Users } from 'lucide-react'
import { useState, useRef } from 'react'
import type { Accommodation } from '@/lib/accommodations/accommodation.types'

interface AccommodationCarouselProps {
  accommodations: Accommodation[]
}

export function AccommodationCarousel({
  accommodations,
}: AccommodationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = 320 // عرض تقریبی هر کارت + gap
    const scrollAmount = cardWidth * 2

    // در RTL، scrollLeft برای اسکرول به جلو (چپ) منفی می‌شود و برای اسکرول به عقب (راست) مثبت
    if (direction === 'right') {
      // اسکرول به راست (عقب در RTL)
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setCurrentIndex((prev) => Math.max(0, prev - 2))
    } else {
      // اسکرول به چپ (جلو در RTL)
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      setCurrentIndex((prev) => Math.min(accommodations.length - 1, prev + 2))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">اقامتگاه‌های پیشنهادی</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('right')}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="قبلی"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scroll('left')}
            disabled={currentIndex >= accommodations.length - 2}
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
        {accommodations.map((accommodation) => (
          <Link
            key={accommodation.code}
            to="/accommodations/$code"
            params={{ code: accommodation.code.toString() }}
            className="flex-shrink-0 w-80"
          >
            <Card className="h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1 overflow-hidden">
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={accommodation.image}
                  alt={accommodation.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {accommodation.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    ✓ تایید شده
                  </div>
                )}
                {accommodation.price.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {accommodation.price.discountPercent}% تخفیف
                  </div>
                )}
                {accommodation.rate_review.score > 0 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {accommodation.rate_review.score.toFixed(1)}
                  </div>
                )}
              </div>
              <CardContent className="p-4 text-right">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {accommodation.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 justify-start">
                  <MapPin size={14} />
                  <span>
                    {accommodation.location.city}، {accommodation.location.province}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 justify-start">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{accommodation.capacity.base} مهمان</span>
                  </div>
                  <span>
                    {accommodation.accommodationMetrics.bedroomsCount} خواب
                  </span>
                  <span>
                    {accommodation.accommodationMetrics.bathroomsCount} حمام
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    {accommodation.price.discountedPrice ? (
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(accommodation.price.discountedPrice)} تومان
                        </span>
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          {formatPrice(accommodation.price.mainPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(accommodation.price.mainPrice)} تومان
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">برای هر شب</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

