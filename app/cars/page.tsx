import { createClient } from '@/lib/supabase/server'
import { CarGrid } from '@/components/cars/CarGrid'
import { Car } from 'lucide-react'
import type { Metadata } from 'next'
import type { Car as CarType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Cars For Sale',
  description: 'Browse our quality used car inventory. Drive away today.',
}

async function getCars(): Promise<CarType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'for_sale')
      .eq('is_import', false)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function CarsPage() {
  const cars = await getCars()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">In Stock</p>
        <h1 className="text-4xl font-bold text-[#1a2744]">Cars For Sale</h1>
        <p className="text-gray-500 mt-2">
          {cars.length > 0
            ? `${cars.length} vehicle${cars.length !== 1 ? 's' : ''} available — drive away today`
            : 'New inventory arriving soon'}
        </p>
      </div>

      {cars.length > 0 ? (
        <CarGrid cars={cars} />
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-xl">
          <Car size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">New inventory coming soon</h2>
          <p className="text-gray-400 mt-2">Check back shortly or contact us for current availability</p>
        </div>
      )}
    </div>
  )
}
