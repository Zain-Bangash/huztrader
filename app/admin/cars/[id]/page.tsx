import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminCarForm } from '@/components/admin/AdminCarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

async function getCar(id: string) {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('cars').select('*').eq('id', id).single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params
  const car = await getCar(id)
  if (!car) return { title: 'Admin — Car Not Found' }
  return { title: `Admin — Edit ${car.year} ${car.make} ${car.model}` }
}

export default async function EditCarPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const car = await getCar(id)
  if (!car) notFound()

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 max-w-4xl">
        <Link href="/admin/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2744] mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Cars
        </Link>
        <h1 className="text-2xl font-bold text-[#1a2744] mb-1">
          Edit {car.year} {car.make} {car.model}
        </h1>
        {car.stock_number && <p className="text-gray-400 text-sm mb-6">Stock #{car.stock_number}</p>}
        <AdminCarForm car={car} mode="edit" />
      </div>
    </div>
  )
}
