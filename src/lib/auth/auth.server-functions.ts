import { createServerFn } from '@tanstack/react-start'
import { sendOtp, validateOtp } from './auth.service'

/**
 * Server function to send OTP
 */
export const sendOtpFn = createServerFn({
  method: 'POST',
})
  .inputValidator((mobile: string) => mobile)
  .handler(async ({ data: mobile }) => {
    return await sendOtp(mobile)
  })

/**
 * Server function to validate OTP
 */
export const validateOtpFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { mobile: string; code: string }) => data)
  .handler(async ({ data }) => {
    return await validateOtp(data.mobile, data.code)
  })

