import type { SendCodeResponse, ValidateCodeResponse } from './auth.types'

const AUTH_BASE_URL = 'https://gw.jabama.com/api/v4/account'

const commonHeaders = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7',
  'Content-Type': 'application/json',
  'Origin': 'https://www.jabama.com',
  'Referer': 'https://www.jabama.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
  'X-Server-Side': 'false',
  'X-Web': 'true',
}

/**
 * Send OTP code to mobile number
 */
export async function sendOtp(mobile: string): Promise<SendCodeResponse> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/send-code`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ mobile }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send code: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

/**
 * Validate OTP code
 */
export async function validateOtp(mobile: string, code: string): Promise<ValidateCodeResponse> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/validate-code`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ mobile, code }),
    })

    if (!response.ok) {
      throw new Error(`Failed to validate code: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error validating OTP:', error)
    throw error
  }
}

