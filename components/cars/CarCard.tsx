import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Camera, Car as CarIcon } from 'lucide-react'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Car } from '@/lib/types'

interface CarCardProps {
  car: Car
  showEnquire?: boolean
}

export function CarCard({ car, showEnquire = true }: CarCardProps) {
  const mainImage = car.images?.[0]
  const photoCount = car.images?.length ?? 0

  const metaParts = [
    car.mileage ? formatMileage(car.mileage) : null,
    car.transmission,
    car.fuel_type,
    car.body_type,
  ].filter(Boolean)

  return (
    <div className="group relative bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300 motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CarIcon size={40} strokeWidth={1.5} className="text-gray-300" />
          </div>
        )}
        {/* Bottom-edge scrim */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/40 to-transparent pointer-events-none" />

        {/* Status badges on scrim pills */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {car.status !== 'for_sale' && (
            <span className="inline-flex rounded bg-ink-900/60 p-0.5">
              <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'}>
                {car.status === 'sold' ? 'Sold' : 'Reserved'}
              </Badge>
            </span>
          )}
          {car.is_import && (
            <span className="inline-flex rounded bg-ink-900/60 p-0.5">
              <Badge variant="import">Fresh Import</Badge>
            </span>
          )}
        </div>

        {/* Photo count */}
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink-900/60 text-white text-[11px] font-medium px-2 py-0.5">
            <Camera size={11} strokeWidth={1.5} />
            {photoCount} photos
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[13px] font-medium text-[#6E7480] tabular-nums">{car.year}</p>

        {/* Stretched link: covers the whole card */}
        <Link href={`/cars/${car.slug}`} className="after:absolute after:inset-0 after:content-[''] rounded">
          <h3 className="font-display font-semibold text-ink-800 text-lg leading-snug group-hover:underline underline-offset-2">
            {car.make} {car.model}
            {car.variant && <span className="font-sans font-normal text-[#6E7480]"> {car.variant}</span>}
          </h3>
        </Link>

        {/* Meta line */}
        {metaParts.length > 0 && (
          <p className="mt-2 text-[13px] text-[#6E7480] tabular-nums">
            {metaParts.join(' · ')}
          </p>
        )}

        {/* Price row */}
        <div className="flex-1" />
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#6E7480]">Drive Away</p>
            <p className="font-display text-[22px] font-bold text-ink-800 tabular-nums leading-tight">
              {formatPrice(car.price)}
            </p>
          </div>
          {showEnquire && car.status === 'for_sale' && (
            <Link
              href={`/cars/${car.slug}#enquire`}
              className="relative z-10 inline-flex items-center gap-1 text-sm font-medium text-ink-800 hover:text-ink-700 hover:underline underline-offset-2 py-1"
            >
              Enquire
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </Link>
          )}
        </div>

        {car.stock_number && (
          <p className="mt-2 text-xs font-mono text-gray-400">#{car.stock_number}</p>
        )}
      </div>
    </div>
  )
}
