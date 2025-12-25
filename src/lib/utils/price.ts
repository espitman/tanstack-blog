/**
 * Convert price from Rials (backend) to Tomans (display)
 * Backend returns prices in Rials, we need to divide by 10 to get Tomans
 */
export function rialToToman(priceInRials: number): number {
  return Math.round(priceInRials / 10)
}

/**
 * Format price to Persian locale with thousand separators
 * @param priceInRials - Price in Rials from backend
 * @returns Formatted price string in Tomans (e.g., "۱,۲۳۴,۵۶۷ تومان")
 */
export function formatPrice(priceInRials: number): string {
  const priceInTomans = rialToToman(priceInRials)
  const formatted = new Intl.NumberFormat('fa-IR').format(priceInTomans)
  return `${formatted} تومان`
}

/**
 * Format price without "تومان" suffix (just the number)
 * @param priceInRials - Price in Rials from backend
 * @returns Formatted price number string (e.g., "۱,۲۳۴,۵۶۷")
 */
export function formatPriceNumber(priceInRials: number): string {
  const priceInTomans = rialToToman(priceInRials)
  return new Intl.NumberFormat('fa-IR').format(priceInTomans)
}

