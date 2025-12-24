import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { getAccommodationByCode, getAccommodationReview } from '@/lib/accommodations/accommodation.server-functions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Star,
} from 'lucide-react'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/accommodations/$code')({
  component: AccommodationDetail,
  loader: async ({ params }: { params: { code: string } }) => {
    const code = parseInt(params.code)
    if (isNaN(code)) {
      throw notFound()
    }

    const [accommodation, review] = await Promise.all([
      getAccommodationByCode({ data: code }),
      getAccommodationReview({ data: code }),
    ])

    if (!accommodation) {
      throw notFound()
    }

    return { accommodation, review }
  },
})

function AccommodationDetail() {
  const { accommodation, review } = Route.useLoaderData()
  const [guests, setGuests] = useState(accommodation.capacity.guests.base)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }, [checkInDate, checkOutDate])

  const totalPrice = useMemo(() => {
    // برای سادگی، از قیمت پایه استفاده می‌کنیم
    return accommodation.price.base * nights
  }, [accommodation.price.base, nights])

  const today = new Date().toISOString().split('T')[0]

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
            <div className="w-1/2 h-full">
              <img
                src={accommodation.placeImages[0]?.url}
                alt={accommodation.title}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              />
            </div>
            <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-1">
              {accommodation.placeImages.slice(1, 5).map((img, idx) => (
                <div key={idx} className="w-full h-full overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption || accommodation.title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                </div>
              ))}
            </div>
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
                          className="w-6 h-6 flex-shrink-0"
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
                      <Label htmlFor="checkIn" className="mb-2 block">
                        تاریخ ورود
                      </Label>
                      <Input
                        id="checkIn"
                        type="date"
                        min={today}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="checkOut" className="mb-2 block">
                        تاریخ خروج
                      </Label>
                      <Input
                        id="checkOut"
                        type="date"
                        min={checkInDate || today}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        disabled={!checkInDate}
                      />
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
      </div>
    </div>
  )
}
