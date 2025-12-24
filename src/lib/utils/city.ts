/**
 * Convert city name (English) to URL slug
 * Example: "Bandar Anzali" -> "bandar_anzali"
 */
export function cityNameToSlug(cityName: string): string {
  return cityName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

/**
 * Convert URL slug to display city name
 * Example: "bandar_anzali" -> "Bandar Anzali"
 */
export function slugToCityName(slug: string): string {
  return slug
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

