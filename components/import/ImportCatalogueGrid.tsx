'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Car as CarIcon, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Car } from '@/lib/types'

interface ImportCatalogueGridProps {
  cars: Car[]
  /** If set, only show this many cards (no search UI — used for preview on /import) */
  preview?: number
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
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, variant..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setFuel('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !fuelFilter
                  ? 'bg-[#111B2E] text-white'
                  : 'bg-[#F1F2F0] text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {fuelTypes.map((f) => (
              <button
                key={f}
                onClick={() => setFuel(f === fuelFilter ? '' : f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  fuelFilter === f
                    ? 'bg-[#111B2E] text-white'
                    : 'bg-[#F1F2F0] text-gray-600 hover:bg-gray-200'
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
        <p className="text-sm text-gray-500 mb-6 tabular-nums">
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} available to import
          {(search || fuelFilter) && ` — filtered from ${cars.length}`}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-card">
          <CarIcon size={40} strokeWidth={1.5} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No vehicles match your search</p>
          <button
            onClick={() => { setSearch(''); setFuel('') }}
            className="mt-3 text-sm text-[#111B2E] font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
  const yearRange = car.year
    ? `${car.year}${car.year_to && car.year_to !== 'CURRENT' ? `–${car.year_to.slice(-4)}` : '+'}`
    : null
  const metaParts = [
    yearRange,
    car.fuel_type,
    car.transmission,
    car.body_type && car.body_type !== 'Van' ? car.body_type : null,
  ].filter(Boolean)

  return (
    <div className="group bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={label}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300 motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CarIcon size={32} strokeWidth={1.5} className="text-gray-300" />
          </div>
        )}
        {/* Bottom-edge scrim */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/40 to-transparent pointer-events-none" />
        {/* Import badge */}
        <div className="absolute top-2 left-2 bg-[#0B1220]/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
          Available to Import
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[#111B2E] text-base leading-snug">
          {label}
        </h3>
        {car.variant && (
          <p className="text-[13px] text-[#6E7480] mt-0.5 line-clamp-1">{car.variant}</p>
        )}

        {/* Meta line */}
        {metaParts.length > 0 && (
          <p className="mt-2 text-[13px] text-[#6E7480] tabular-nums">
            {metaParts.join(' · ')}
          </p>
        )}

        {/* CTA */}
        <div className="flex-1" />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/import#quote`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#111B2E] hover:text-[#1C2A45] hover:underline underline-offset-2"
          >
            Get Import Quote
            <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        </div>
      </div>
    </div>
  )
}
