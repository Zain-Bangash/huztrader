'use client'
import { useState, useMemo } from 'react'
import { CarCard } from './CarCard'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Car } from '@/lib/types'

interface FiltersState {
  make: string
  bodyType: string
  transmission: string
  fuelType: string
  maxPrice: string
  sort: string
}

const DEFAULT_FILTERS: FiltersState = {
  make: '', bodyType: '', transmission: '', fuelType: '', maxPrice: '', sort: 'newest',
}

interface CarGridProps {
  cars: Car[]
  showSoldBadge?: boolean
}

export function CarGrid({ cars, showSoldBadge = false }: CarGridProps) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const makes = useMemo(() => [...new Set(cars.map((c) => c.make))].sort(), [cars])
  const bodyTypes = useMemo(() => [...new Set(cars.map((c) => c.body_type).filter(Boolean))].sort() as string[], [cars])
  const transmissions = useMemo(() => [...new Set(cars.map((c) => c.transmission).filter(Boolean))].sort() as string[], [cars])
  const fuelTypes = useMemo(() => [...new Set(cars.map((c) => c.fuel_type).filter(Boolean))].sort() as string[], [cars])

  const filtered = useMemo(() => {
    let result = [...cars]
    if (filters.make) result = result.filter((c) => c.make === filters.make)
    if (filters.bodyType) result = result.filter((c) => c.body_type === filters.bodyType)
    if (filters.transmission) result = result.filter((c) => c.transmission === filters.transmission)
    if (filters.fuelType) result = result.filter((c) => c.fuel_type === filters.fuelType)
    if (filters.maxPrice) result = result.filter((c) => !c.price || c.price <= Number(filters.maxPrice))
    if (filters.sort === 'price_asc') result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (filters.sort === 'price_desc') result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    if (filters.sort === 'mileage_asc') result.sort((a, b) => (a.mileage ?? 0) - (b.mileage ?? 0))
    if (filters.sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [cars, filters])

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v !== '')

  const set = (key: keyof FiltersState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4 lg:mb-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#1a2744]" />
            <span className="font-semibold text-[#1a2744] text-sm">Filter Results</span>
            <span className="text-gray-400 text-sm">({filtered.length} cars)</span>
          </div>
          <button
            className="lg:hidden text-sm text-[#1a2744] underline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} filters
          </button>
        </div>

        <div className={`grid grid-cols-2 lg:grid-cols-6 gap-3 mt-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
          <Select value={filters.make} onChange={set('make')}>
            <option value="">All Makes</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>

          <Select value={filters.bodyType} onChange={set('bodyType')}>
            <option value="">Body Type</option>
            {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>

          <Select value={filters.transmission} onChange={set('transmission')}>
            <option value="">Transmission</option>
            {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>

          <Select value={filters.fuelType} onChange={set('fuelType')}>
            <option value="">Fuel Type</option>
            {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>

          <Input
            type="number"
            placeholder="Max price (AUD)"
            value={filters.maxPrice}
            onChange={set('maxPrice')}
          />

          <Select value={filters.sort} onChange={set('sort')}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="mileage_asc">Lowest Km</option>
          </Select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
          >
            <X size={14} /> Reset filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} showEnquire={!showSoldBadge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 font-medium">No cars match your filters</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
