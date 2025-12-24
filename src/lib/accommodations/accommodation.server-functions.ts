import { createServerFn } from '@tanstack/react-start'
import {
  getAccommodations,
  getAccommodationDetail,
  getAccommodationReviewSummary,
} from './accommodation.service'
import type { AccommodationSearchParams } from './accommodation.types'

// Fetch accommodations
export const getAllAccommodations = createServerFn({
  method: 'GET',
})
  .inputValidator((params: AccommodationSearchParams = {}) => params)
  .handler(async ({ data: params }) => {
    return await getAccommodations(params)
  })

// Fetch accommodation detail by code
export const getAccommodationByCode = createServerFn({
  method: 'GET',
})
  .inputValidator((code: number) => code)
  .handler(async ({ data: code }) => {
    const result = await getAccommodationDetail(code)
    if (!result) return null
    // Fix badges.data type compatibility
    return {
      ...result,
      badges: {
        ...result.badges,
        data: result.badges.data as {}[],
      },
    }
  })

// Fetch review summary
export const getAccommodationReview = createServerFn({
  method: 'GET',
})
  .inputValidator((code: number) => code)
  .handler(async ({ data: code }) => {
    return await getAccommodationReviewSummary(code)
  })

