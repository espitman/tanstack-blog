'use client'

import { IranMap } from 'react-iran-map'
import { useNavigate } from '@tanstack/react-router'
import { provinceKeyToEnglishName } from '@/lib/utils/province'
import type { Accommodation } from '@/lib/accommodations/accommodation.types'
import { useState, useEffect } from 'react'

interface IranMapSectionProps {
  accommodations: Accommodation[]
}

export function IranMapSection({ accommodations }: IranMapSectionProps) {
  const navigate = useNavigate()
  const [mapData, setMapData] = useState<Record<string, number>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Count accommodations per province
    const provinceCounts: Record<string, number> = {}
    
    accommodations.forEach((acc) => {
      const provinceEn = acc.location.provinceEn || acc.location.province
      const slug = provinceEn.toLowerCase().replace(/\s+/g, '_')
      
      // Map to react-iran-map keys
      const mapKey = Object.keys(provinceKeyToEnglishName).find(
        (key) => provinceKeyToEnglishName[key] === slug
      ) || slug
      
      provinceCounts[mapKey] = (provinceCounts[mapKey] || 0) + 1
    })

    // Initialize all provinces with 0
    const allProvinces: Record<string, number> = {
      ardabil: 0,
      isfahan: 0,
      alborz: 0,
      ilam: 0,
      eastAzerbaijan: 0,
      westAzerbaijan: 0,
      bushehr: 0,
      tehran: 0,
      chaharmahalandBakhtiari: 0,
      southKhorasan: 0,
      razaviKhorasan: 0,
      northKhorasan: 0,
      khuzestan: 0,
      zanjan: 0,
      semnan: 0,
      sistanAndBaluchestan: 0,
      fars: 0,
      qazvin: 0,
      qom: 0,
      kurdistan: 0,
      kerman: 0,
      kohgiluyehAndBoyerAhmad: 0,
      kermanshah: 0,
      golestan: 0,
      gilan: 0,
      lorestan: 0,
      mazandaran: 0,
      markazi: 0,
      hormozgan: 0,
      hamadan: 0,
      yazd: 0,
    }


    setMapData(allProvinces)
  }, [accommodations])

  const selectProvinceHandler = (province: string | { faName: string; name: string }) => {
    // react-iran-map returns an object with {faName, name}
    const provinceKey = typeof province === 'string' ? province : province.name
    const slug = provinceKeyToEnglishName[provinceKey] || provinceKey
    navigate({ to: '/province/$name', params: { name: slug } })
  }

  if (!isClient) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">نقشه ایران</h2>
            <p className="text-gray-600">برای مشاهده اقامتگاه‌های هر استان روی آن کلیک کنید</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="h-[500px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">نقشه ایران</h2>
          <p className="text-gray-600">برای مشاهده اقامتگاه‌های هر استان روی آن کلیک کنید</p>
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <IranMap
            data={mapData}
            colorRange="59, 130, 246"
            width={1000}
            textColor="#1f2937"
            deactiveProvinceColor="#f3f4f6"
            selectedProvinceColor="#3b82f6"
            selectProvinceHandler={selectProvinceHandler}
          />
        </div>
      </div>
    </section>
  )
}

