import { createServiceClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminEnquiriesList } from '@/components/admin/AdminEnquiriesList'
import type { Metadata } from 'next'
import type { Enquiry } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Enquiries' }

async function getEnquiries() {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('enquiries')
      .select('*, car:cars(make, model, year)')
      .order('created_at', { ascending: false })
      .limit(100)
    return (data ?? []) as Array<Enquiry & { car?: { make: string; model: string; year: number } }>
  } catch {
    return []
  }
}

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries()

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2744]">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">{enquiries.length} total enquiries</p>
        </div>

        <AdminEnquiriesList enquiries={enquiries} />
      </div>
    </div>
  )
}
