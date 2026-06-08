import { createServiceClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminCarTable } from '@/components/admin/AdminCarTable'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Cars' }

async function getAllCars() {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminCarsPage() {
  const cars = await getAllCars()

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2744]">Cars</h1>
            <p className="text-gray-500 text-sm mt-0.5">{cars.length} total vehicles in inventory</p>
          </div>
          <Link
            href="/admin/cars/new"
            className="flex items-center gap-1.5 bg-[#1a2744] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#243561] transition-colors"
          >
            <Plus size={16} /> Add Car
          </Link>
        </div>
        <AdminCarTable cars={cars} />
      </div>
    </div>
  )
}
