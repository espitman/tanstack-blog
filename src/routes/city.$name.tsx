import { createFileRoute, Link } from '@tanstack/react-router'
import { getAccommodationsByCityFn } from '@/lib/accommodations/accommodation.server-functions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AccommodationsListSkeleton } from '@/components/AccommodationsListSkeleton'
import { AccommodationCardSkeleton } from '@/components/AccommodationCardSkeleton'
import { ChevronRight, ChevronLeft, Star, MapPin, Users, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Accommodation } from '@/lib/accommodations/accommodation.types'
import { cityNameToSlug } from '@/lib/utils/city'

export const Route = createFileRoute('/city/$name')({
  component: CityAccommodations,
  pendingComponent: AccommodationsListSkeleton,
  pendingMs: 0,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
    }
  },
  loader: async ({ params }) => {
    const cityName = params.name
    const pageSize = 15
    
    const accommodations = await getAccommodationsByCityFn({
      data: { cityName, params: { pageSize, pageNumber: 1 } },
    })
    
    const hasMore = accommodations.length === pageSize
    return { accommodations, pageSize, hasMore, cityName }
  },
})

function CityAccommodations() {
  const { accommodations: initialAccommodations, pageSize, hasMore: initialHasMore, cityName } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const currentPage = search.page || 1

  const [accommodations, setAccommodations] = useState<Accommodation[]>(initialAccommodations)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentPage === 1 && accommodations === initialAccommodations) return

    setIsLoading(true)
    getAccommodationsByCityFn({
      data: { cityName, params: { pageSize, pageNumber: currentPage } },
    }).then((data) => {
      setAccommodations(data)
      setHasMore(data.length === pageSize)
      setIsLoading(false)
    })
  }, [currentPage, pageSize, cityName, initialAccommodations])

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/city/$name',
      params: { name: cityName },
      search: { page: newPage },
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  // Get Persian city name from first accommodation or use slug conversion as fallback
  const displayCityName = accommodations.length > 0 
    ? accommodations[0].location.city 
    : cityName
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">اقامتگاه‌های {displayCityName}</h1>
            <p className="text-gray-600">انتخاب از بین {accommodations.length} اقامتگاه</p>
          </div>
          <div className="flex gap-3">
            <Link to="/accommodations">
              <Button variant="outline">همه اقامتگاه‌ها</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <ArrowRight size={16} className="ml-2" />
                صفحه اصلی
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: pageSize }).map((_, index) => (
              <AccommodationCardSkeleton key={index} />
            ))}
          </div>
        ) : accommodations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">هیچ اقامتگاهی در {displayCityName} یافت نشد</p>
            <Link to="/accommodations">
              <Button>مشاهده همه اقامتگاه‌ها</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {accommodations.map((accommodation: Accommodation) => (
                <Link
                  key={accommodation.code}
                  to="/accommodations/$code"
                  params={{ code: accommodation.code.toString() }}
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
                          <Link
                            to="/city/$name"
                            params={{ name: cityNameToSlug(accommodation.location.cityEn || accommodation.location.city) }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {accommodation.location.city}
                          </Link>
                          ،{' '}
                          <Link
                            to="/province/$name"
                            params={{ name: cityNameToSlug(accommodation.location.provinceEn || accommodation.location.province) }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {accommodation.location.province}
                          </Link>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 justify-start">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{accommodation.capacity.base} مهمان</span>
                        </div>
                        <span>{accommodation.accommodationMetrics.bedroomsCount} خواب</span>
                        <span>{accommodation.accommodationMetrics.bathroomsCount} حمام</span>
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

            {/* Pagination */}
            {(currentPage > 1 || hasMore) && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronRight size={16} />
                  قبلی
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">صفحه {currentPage}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMore}
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

