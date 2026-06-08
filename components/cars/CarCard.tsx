import Link from 'next/link'
import Image from 'next/image'
import { Fuel, Settings2, Gauge, Car as CarIcon } from 'lucide-react'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Car } from '@/lib/types'

interface CarCardProps {
  car: Car
  showEnquire?: boolean
}

export function CarCard({ car, showEnquire = true }: CarCardProps) {
  const mainImage = car.images?.[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <Link href={`/cars/${car.slug}`} className="relative block aspect-[4/3] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CarIcon size={40} className="text-gray-300" />
          </div>
        )}
        {/* Status badge */}
        {car.status !== 'for_sale' && (
          <div className="absolute top-2 left-2">
            <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'}>
              {car.status === 'sold' ? 'Sold' : 'Reserved'}
            </Badge>
          </div>
        )}
        {car.is_import && (
          <div className="absolute top-2 right-2">
            <Badge variant="import">Import</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {car.stock_number && (
          <p className="text-xs text-gray-400 mb-1">Stock #{car.stock_number}</p>
        )}
        <Link href={`/cars/${car.slug}`}>
          <h3 className="font-bold text-[#1a2744] text-base leading-snug hover:text-[#e8b84b] transition-colors">
            {car.year} {car.make} {car.model}
            {car.variant && <span className="font-normal text-gray-500"> {car.variant}</span>}
          </h3>
        </Link>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {car.body_type && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1">
              <CarIcon size={11} />
              {car.body_type}
            </span>
          )}
          {car.transmission && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1">
              <Settings2 size={11} />
              {car.transmission}
            </span>
          )}
          {car.fuel_type && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1">
              <Fuel size={11} />
              {car.fuel_type}
            </span>
          )}
          {car.mileage && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1">
              <Gauge size={11} />
              {formatMileage(car.mileage)}
            </span>
          )}
        </div>

        {/* Price + actions */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
          <div>
            <p className="text-xs text-gray-400">Drive Away</p>
            <p className="text-xl font-bold text-[#1a2744]">{formatPrice(car.price)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/cars/${car.slug}`}
              className="text-sm font-medium text-[#1a2744] border border-[#1a2744] px-3 py-1.5 rounded-md hover:bg-[#1a2744] hover:text-white transition-colors"
            >
              View
            </Link>
            {showEnquire && car.status === 'for_sale' && (
              <Link
                href={`/cars/${car.slug}#enquire`}
                className="text-sm font-medium bg-[#e8b84b] text-[#0f1117] px-3 py-1.5 rounded-md hover:bg-[#d4a53a] transition-colors"
              >
                Enquire
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
