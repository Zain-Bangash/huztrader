'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Car as CarIcon, Fuel, Settings2, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Car } from '@/lib/types'

interface ImportCatalogueGridProps {
  cars: Car[]
  /** If set, only show this many cards (no search UI — used for preview on /import) */
  preview?: number
}

const FUEL_COLORS: Record<string, string> = {
  Electric: 'bg-green-100 text-green-700',
  Hybrid:   'bg-teal-100 text-teal-700',
  Petrol:   'bg-blue-100 text-blue-700',
  Diesel:   'bg-orange-100 text-orange-700',
}

export function ImportCatalogueGrid({ cars, preview }: ImportCatalogueGridProps) {
  const [search, setSearch]   = useState('')
  const [fuelFilter, setFuel] = useState('')

  const isPreview = typeof preview === 'number'

  const fuelTypes = useMemo(() => {
    const set = new Set(cars.map((c) => c.fuel_type).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [cars])

  const filtered = useMemo(() => {
    if (isPreview) return cars.slice(0, preview)
    const q = search.toLowerCase()
    return cars.filter((c) => {
      const matchSearch =
        !q ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        (c.variant ?? '').toLowerCase().includes(q)
      const matchFuel = !fuelFilter || c.fuel_type === fuelFilter
      return matchSearch && matchFuel
    })
  }, [cars, search, fuelFilter, isPreview, preview])

  return (
    <div>
      {/* Filters — hidden in preview mode */}
      {!isPreview && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, variant..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFuel('')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !fuelFilter
                  ? 'bg-[#1a2744] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {fuelTypes.map((f) => (
              <button
                key={f}
                onClick={() => setFuel(f === fuelFilter ? '' : f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  fuelFilter === f
                    ? 'bg-[#1a2744] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count — hidden in preview mode */}
      {!isPreview && (
        <p className="text-sm text-gray-500 mb-6">
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} available to import
          {(search || fuelFilter) && ` — filtered from ${cars.length}`}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <CarIcon size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No vehicles match your search</p>
          <button
            onClick={() => { setSearch(''); setFuel('') }}
            className="mt-3 text-sm text-[#e8b84b] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((car) => (
            <ImportCarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}

function ImportCarCard({ car }: { car: Car }) {
  const mainImage = car.images?.[0]
  const label = `${car.year ? car.year + ' ' : ''}${car.make} ${car.model}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={label}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CarIcon size={32} className="text-gray-300" />
          </div>
        )}
        {/* Import badge */}
        <div className="absolute top-2 left-2 bg-[#e8b84b] text-[#0f1a33] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          Available to Import
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#1a2744] text-sm leading-snug">
          {label}
        </h3>
        {car.variant && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{car.variant}</p>
        )}

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {car.year && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-0.5">
              <Calendar size={10} />
              {car.year}{car.year_to && car.year_to !== 'CURRENT' ? `–${car.year_to.slice(-4)}` : '+'}
            </span>
          )}
          {car.fuel_type && (
            <span className={`inline-flex items-center gap-1 text-xs rounded px-2 py-0.5 font-medium ${FUEL_COLORS[car.fuel_type] ?? 'bg-gray-100 text-gray-600'}`}>
              <Fuel size={10} />
              {car.fuel_type}
            </span>
          )}
          {car.body_type && car.body_type !== 'Van' && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-0.5">
              <CarIcon size={10} />
              {car.body_type}
            </span>
          )}
          {car.transmission && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-0.5">
              <Settings2 size={10} />
              {car.transmission}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-gray-100 mt-4">
          <Link
            href={`/import#quote`}
            className="block w-full text-center text-sm font-semibold bg-[#1a2744] text-white py-2 rounded-lg hover:bg-[#243561] transition-colors"
          >
            Get Import Quote
          </Link>
        </div>
      </div>
    </div>
  )
}
