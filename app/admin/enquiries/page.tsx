import { createServiceClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'
import type { Enquiry } from '@/lib/types'

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

const TYPE_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  car_quote: 'bg-blue-100 text-blue-700',
  import_quote: 'bg-purple-100 text-purple-700',
}
const TYPE_LABELS: Record<string, string> = {
  general: 'General',
  car_quote: 'Car Enquiry',
  import_quote: 'Import Quote',
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

        {enquiries.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200 text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[enquiry.type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {TYPE_LABELS[enquiry.type] ?? enquiry.type}
                      </span>
                      {enquiry.department && (
                        <span className="text-xs text-gray-400">{enquiry.department}</span>
                      )}
                      {enquiry.car && (
                        <span className="text-xs text-blue-600 font-medium">
                          Re: {enquiry.car.year} {enquiry.car.make} {enquiry.car.model}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-[#1a2744]">
                      {enquiry.first_name} {enquiry.last_name}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <Mail size={13} /> {enquiry.email}
                      </a>
                      {enquiry.phone && (
                        <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a2744]">
                          <Phone size={13} /> {enquiry.phone}
                        </a>
                      )}
                    </div>
                    {enquiry.message && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                        {enquiry.message}
                      </p>
                    )}
                    {(enquiry.budget || enquiry.location) && (
                      <div className="flex gap-4 mt-2 flex-wrap text-xs text-gray-500">
                        {enquiry.budget && <span>Budget: <strong>{enquiry.budget}</strong></span>}
                        {enquiry.location && <span>Location: <strong>{enquiry.location}</strong></span>}
                      </div>
                    )}
                    {enquiry.contact_pref && enquiry.contact_pref.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Prefers: {enquiry.contact_pref.join(', ')}
                        {enquiry.preferred_time && ` · ${enquiry.preferred_time}`}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {new Date(enquiry.created_at).toLocaleString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
