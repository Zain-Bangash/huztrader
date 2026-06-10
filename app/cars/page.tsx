import { createClient } from '@/lib/supabase/server'
import { CarGrid } from '@/components/cars/CarGrid'
import { Car } from 'lucide-react'
import type { Metadata } from 'next'
import type { Car as CarType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cars For Sale',
  description: 'Browse our full inventory — in-stock and available to order. Enquire on any vehicle today.',
}

async function getCars(): Promise<CarType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'for_sale')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function CarsPage() {
  const cars = await getCars()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111B2E]">Cars For Sale</h1>
        <p className="text-gray-500 mt-1.5">
          {cars.length > 0
            ? `${cars.length} vehicle${cars.length !== 1 ? 's' : ''} available — enquire on any car today`
            : 'New inventory arriving soon'}
        </p>
      </div>

      {cars.length > 0 ? (
        <CarGrid cars={cars} />
      ) : (
        <div className="text-center py-24 bg-white rounded-xl shadow-card">
          <Car size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">New inventory coming soon</h2>
          <p className="text-gray-400 mt-2">Check back shortly or contact us for current availability</p>
        </div>
      )}
    </div>
  )
}
