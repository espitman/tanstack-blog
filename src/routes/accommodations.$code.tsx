import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAccommodationByCode, getAccommodationReview } from '@/lib/accommodations/accommodation.server-functions'
import { getLatestPostsFn } from '@/lib/posts/posts.server-functions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PostsCarousel } from '@/components/PostsCarousel'
import { MapPin, Star, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import type { AccommodationDetail, ReviewSummary } from '@/lib/accommodations/accommodation.types'
import type { Post } from '@/lib/posts/posts.types'
import DatePicker, { DateObject } from 'react-multi-date-picker'
// @ts-ignore
const DatePickerComponent = DatePicker.default || DatePicker
import persian from 'react-date-object/calendars/persian'
// @ts-ignore
const persianCalendar = persian.default || persian
import persian_fa from 'react-date-object/locales/persian_fa'
// @ts-ignore
const persianLocale = persian_fa.default || persian_fa
import 'react-multi-date-picker/styles/layouts/mobile.css'

export const Route = createFileRoute('/accommodations/$code')({
  component: AccommodationDetail,
  loader: async ({ params }: { params: { code: string } }) => {
    const code = parseInt(params.code)
    if (isNaN(code)) {
      throw notFound()
    }

    const [accommodation, review, latestPosts] = await Promise.all([
      getAccommodationByCode({ data: code }),
      getAccommodationReview({ data: code }),
      getLatestPostsFn({ data: { excludeSlug: '', limit: 5 } }),
    ])

    if (!accommodation) {
      throw notFound()
    }

    // Format dates on server to avoid hydration mismatch
    const latestPostsWithFormattedDates = latestPosts.map((p) => ({
      ...p,
      formattedDate: formatPersianDateShort(p.createdAt),
    }))

    return { accommodation, review, latestPosts: latestPostsWithFormattedDates }
  },
})

function AccommodationDetail() {
  const { accommodation, review, latestPosts } = Route.useLoaderData() as {
    accommodation: AccommodationDetail
    review: ReviewSummary | null
    latestPosts: Post[]
  }
  const [guests, setGuests] = useState(accommodation.capacity.guests.base)
  const [checkInDate, setCheckInDate] = useState<DateObject | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<DateObject | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen || !accommodation.placeImages) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLightboxIndex((prev) => (prev + 1) % accommodation.placeImages.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLightboxIndex((prev) => (prev - 1 + accommodation.placeImages.length) % accommodation.placeImages.length)
      } else if (e.key === 'Escape') {
        setLightboxOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, accommodation.placeImages])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    if (accommodation.placeImages) {
      setLightboxIndex((prev) => (prev + 1) % accommodation.placeImages.length)
    }
  }

  const prevImage = () => {
    if (accommodation.placeImages) {
      setLightboxIndex((prev) => (prev - 1 + accommodation.placeImages.length) % accommodation.placeImages.length)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0
    const checkIn = checkInDate.toDate()
    const checkOut = checkOutDate.toDate()
    
    // Reset hours to compare only dates
    checkIn.setHours(0, 0, 0, 0)
    checkOut.setHours(0, 0, 0, 0)
    
    const diffTime = checkOut.getTime() - checkIn.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  }, [checkInDate, checkOutDate])

  const totalPrice = useMemo(() => {
    return accommodation.price.base * (nights || 1)
  }, [accommodation.price.base, nights])


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title and Rating */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {accommodation.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star size={20} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">
                {accommodation.rateAndReview.score.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({accommodation.rateAndReview.count} نظر)
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              <span>
                {accommodation.placeOfResidence.area.city.name.fa}،{' '}
                {accommodation.placeOfResidence.area.city.province.name.fa}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery - Full Width */}
      {accommodation.placeImages && accommodation.placeImages.length > 0 && (
        <div className="container mx-auto h-[400px] md:h-[500px] mb-8 overflow-hidden">
          <div className="flex gap-1 h-full">
            <div className="w-1/2 h-full" onClick={() => openLightbox(0)}>
              <img
                src={accommodation.placeImages[0]?.url}
                alt={accommodation.title}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer rounded-r-2xl"
              />
            </div>
            <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-1">
              {accommodation.placeImages.slice(1, 5).map((img, idx) => (
                <div key={idx} className="w-full h-full overflow-hidden" onClick={() => openLightbox(idx + 1)}>
                  <img
                    src={img.url}
                    alt={''+idx}
                    className={`w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer ${idx === 1 ? 'rounded-tl-2xl' : idx === 3 ? 'rounded-bl-2xl' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && accommodation.placeImages && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"
            aria-label="بستن"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
            aria-label="عکس قبلی"
          >
            <ChevronRight size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
            aria-label="عکس بعدی"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={accommodation.placeImages[lightboxIndex]?.url}
              alt={accommodation.placeImages[lightboxIndex]?.caption || accommodation.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {accommodation.placeImages.length}
          </div>
        </div>
      )}

      <div className="container mx-auto px-0 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">درباره این اقامتگاه</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {accommodation.description}
              </p>
            </div>

            {/* More Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">اطلاعات بیشتر</h2>
              <div className="space-y-4">
                {accommodation.extraDescription &&
                  accommodation.extraDescription.map((desc, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-lg mb-2">{desc.title}</h3>
                      {desc.subTitle && (
                        <h4 className="font-medium text-gray-700 mb-2">{desc.subTitle}</h4>
                      )}
                      <p className="text-gray-600 leading-relaxed">{desc.text}</p>
                    </div>
                  ))}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <span className="text-gray-600">تعداد مهمان: </span>
                    <span className="font-semibold">
                      {accommodation.capacity.guests.base} مهمان
                      {accommodation.capacity.guests.extra > 0 &&
                        ` + ${accommodation.capacity.guests.extra} اضافه`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">تعداد خواب: </span>
                    <span className="font-semibold">
                      {accommodation.accommodationMetrics.bedroomsCount} خواب
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">تعداد حمام: </span>
                    <span className="font-semibold">
                      {accommodation.accommodationMetrics.bathroomsCount} حمام
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">متراژ: </span>
                    <span className="font-semibold">
                      {accommodation.accommodationMetrics.areaSize} متر مربع
                    </span>
                  </div>
                  {accommodation.badges.data && (
                    <div className="col-span-2">
                      <span className="text-gray-600">مدخل اقامتگاه: </span>
                      <span className="font-semibold">مستقل</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">امکانات اقامتگاه</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {accommodation.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      {amenity.icon?.url && (
                        <img
                          src={amenity.icon.url}
                          alt={amenity.title.fa}
                          className="w-6 h-6 shrink-0"
                        />
                      )}
                      <span className="text-sm text-gray-700">{amenity.title.fa}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {accommodation.cancellationPolicyText && (
              <div>
                <h2 className="text-2xl font-bold mb-4">سیاست لغو رزرو</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {accommodation.cancellationPolicyText}
                </p>
                {accommodation.cancellationPolicyDetails && (
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        {accommodation.cancellationPolicyDetails.beforeCheckIn.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {accommodation.cancellationPolicyDetails.beforeCheckIn.text}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        {accommodation.cancellationPolicyDetails.untilCheckIn.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {accommodation.cancellationPolicyDetails.untilCheckIn.text}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        {accommodation.cancellationPolicyDetails.afterCheckIn.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {accommodation.cancellationPolicyDetails.afterCheckIn.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Summary */}
            {review && (
              <div>
                <h2 className="text-2xl font-bold mb-4">خلاصه نظرات مهمانان</h2>
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-6">{review.summary}</p>
                    {review.strengths.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-3 text-green-700">
                          نقاط قوت
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {review.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.weaknesses.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-red-700">
                          نقاط ضعف
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {review.weaknesses.map((weakness, idx) => (
                            <li key={idx}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Left Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2 shadow-xl">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(accommodation.price.base)}
                      </span>
                      <span className="text-gray-600">تومان / شب</span>
                    </div>
                    {accommodation.price.holiday !== accommodation.price.base && (
                      <div className="text-sm text-gray-600">
                        تعطیلات: {formatPrice(accommodation.price.holiday)} تومان
                      </div>
                    )}
                  </div>

                  {/* Check-in/Check-out Times */}
                  <div className="flex items-center justify-between py-3 border-y mb-6 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">ورود</div>
                      <div className="font-semibold">{accommodation.checkIn}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">خروج</div>
                      <div className="font-semibold">{accommodation.checkOut}</div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="guests" className="mb-2 block">
                        تعداد مهمان
                      </Label>
                      <Input
                        id="guests"
                        type="number"
                        min={1}
                        max={accommodation.capacity.guests.base + accommodation.capacity.guests.extra}
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">تاریخ ورود</Label>
                      {isClient ? (
                        <DatePickerComponent
                          value={checkInDate}
                          onChange={setCheckInDate}
                          calendar={persianCalendar}
                          locale={persianLocale}
                          calendarPosition="bottom-right"
                          minDate={new Date()}
                          inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          containerClassName="w-full"
                        />
                      ) : (
                        <div className="h-10 w-full rounded-md border border-input bg-background animate-pulse" />
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block">تاریخ خروج</Label>
                      {isClient ? (
                        <DatePickerComponent
                          value={checkOutDate}
                          onChange={setCheckOutDate}
                          calendar={persianCalendar}
                          locale={persianLocale}
                          calendarPosition="bottom-right"
                          minDate={checkInDate ? new Date(checkInDate.toDate().getTime() + 24 * 60 * 60 * 1000) : new Date()}
                          disabled={!checkInDate}
                          inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          containerClassName="w-full"
                        />
                      ) : (
                        <div className="h-10 w-full rounded-md border border-input bg-background animate-pulse" />
                      )}
                    </div>

                    {checkInDate && checkOutDate && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">تعداد شب</div>
                        <div className="font-semibold text-lg">{nights} شب</div>
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="py-4 border-t border-b mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">مبلغ کل</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(totalPrice)} تومان
                      </span>
                    </div>
                  </div>

                  {/* Host Information */}
                  {accommodation.hostProfile && accommodation.hostProfile.items.length > 0 && (
                    <div className="mb-6 pb-6 border-b">
                      <h3 className="font-semibold mb-3">اطلاعات میزبان</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {accommodation.rateAndReview.score.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {accommodation.rateAndReview.count} نظر
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Booking Button */}
                  <Button className="w-full" size="lg">
                    رزرو این اقامتگاه
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Posts Carousel Section */}
        {latestPosts && latestPosts.length > 0 && (
          <section className="mt-16">
            <PostsCarousel posts={latestPosts} />
          </section>
        )}
      </div>
    </div>
  )
}
