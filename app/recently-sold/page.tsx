import { createClient } from '@/lib/supabase/server'
import { CarCard } from '@/components/cars/CarCard'
import { Car } from 'lucide-react'
import type { Metadata } from 'next'
import type { Car as CarType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Recently Sold',
  description: 'Browse our recently sold vehicles.',
}

async function getSoldCars(): Promise<CarType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'sold')
      .order('updated_at', { ascending: false })
      .limit(48)
    return data ?? []
  } catch {
    return []
  }
}

export default async function RecentlySoldPage() {
  const cars = await getSoldCars()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">Track Record</p>
        <h1 className="text-4xl font-bold text-[#1a2744]">Recently Sold</h1>
        <p className="text-gray-500 mt-2">Vehicles we&apos;ve found great homes for</p>
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} showEnquire={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-xl">
          <Car size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No sold vehicles to display yet</p>
        </div>
      )}
    </div>
  )
}
