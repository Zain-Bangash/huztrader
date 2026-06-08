import { AdminNav } from '@/components/admin/AdminNav'
import { AdminCarForm } from '@/components/admin/AdminCarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Add Car' }

export default function NewCarPage() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 max-w-4xl">
        <Link href="/admin/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2744] mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Cars
        </Link>
        <h1 className="text-2xl font-bold text-[#1a2744] mb-6">Add New Car</h1>
        <AdminCarForm mode="create" />
      </div>
    </div>
  )
}
