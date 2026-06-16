'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MessageSquare, Trash2 } from 'lucide-react'
import type { Enquiry } from '@/lib/types'

type EnquiryWithCar = Enquiry & { car?: { make: string; model: string; year: number } }

interface AdminEnquiriesListProps {
  enquiries: EnquiryWithCar[]
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

export function AdminEnquiriesList({ enquiries }: AdminEnquiriesListProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete the enquiry from ${name}? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
      else alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (enquiries.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-xl border border-gray-200 text-gray-400">
        <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
        <p>No enquiries yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {enquiries.map((enquiry) => {
        const name = `${enquiry.first_name} ${enquiry.last_name}`
        return (
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
                <div className="font-semibold text-[#1a2744]">{name}</div>
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
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-xs text-gray-400">
                  {new Date(enquiry.created_at).toLocaleString('en-AU', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
                <button
                  onClick={() => handleDelete(enquiry.id, name)}
                  disabled={deleting === enquiry.id}
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete enquiry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
