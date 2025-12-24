/**
 * Mapping between react-iran-map province keys and English province names
 */
export const provinceKeyToEnglishName: Record<string, string> = {
  ardabil: 'ardabil',
  isfahan: 'isfahan',
  alborz: 'alborz',
  ilam: 'ilam',
  eastAzerbaijan: 'east_azerbaijan',
  westAzerbaijan: 'west_azerbaijan',
  bushehr: 'bushehr',
  tehran: 'tehran',
  chaharmahalandBakhtiari: 'chaharmahal_and_bakhtiari',
  southKhorasan: 'south_khorasan',
  razaviKhorasan: 'khorasan_razavi',
  northKhorasan: 'north_khorasan',
  khuzestan: 'khuzestan',
  zanjan: 'zanjan',
  semnan: 'semnan',
  sistanAndBaluchestan: 'sistan_and_baluchestan',
  fars: 'fars',
  qazvin: 'qazvin',
  qom: 'qom',
  kurdistan: 'kurdistan',
  kerman: 'kerman',
  kohgiluyehAndBoyerAhmad: 'kohgiluyeh_and_boyer_ahmad',
  kermanshah: 'kermanshah',
  golestan: 'golestan',
  gilan: 'gilan',
  lorestan: 'lorestan',
  mazandaran: 'mazandaran',
  markazi: 'markazi',
  hormozgan: 'hormozgan',
  hamadan: 'hamadan',
  yazd: 'yazd',
}

/**
 * Convert react-iran-map province key to URL slug
 */
export function provinceKeyToSlug(provinceKey: string): string {
  return provinceKeyToEnglishName[provinceKey] || provinceKey
}

