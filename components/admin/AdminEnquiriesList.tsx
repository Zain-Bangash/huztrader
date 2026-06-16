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
  const [bulkBusy, setBulkBusy] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const allSelected = enquiries.length > 0 && selected.size === enquiries.length

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) => (prev.size === enquiries.length ? new Set() : new Set(enquiries.map((e) => e.id))))
  }

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

  const handleDeleteSelected = async () => {
    const count = selected.size
    if (count === 0) return
    if (!confirm(`Delete ${count} selected ${count === 1 ? 'enquiry' : 'enquiries'}? This cannot be undone.`)) return
    setBulkBusy(true)
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selected] }),
      })
      if (res.ok) {
        setSelected(new Set())
        router.refresh()
      } else {
        alert('Failed to delete. Please try again.')
      }
    } finally {
      setBulkBusy(false)
    }
  }

  const handleDeleteAll = async () => {
    if (enquiries.length === 0) return
    if (!confirm(`Delete ALL ${enquiries.length} enquiries? This cannot be undone.`)) return
    setBulkBusy(true)
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      if (res.ok) {
        setSelected(new Set())
        router.refresh()
      } else {
        alert('Failed to delete. Please try again.')
      }
    } finally {
      setBulkBusy(false)
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
    <div>
      {/* Bulk action toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-gray-300 text-[#1a2744] focus:ring-[#1a2744]"
          />
          {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDeleteSelected}
            disabled={selected.size === 0 || bulkBusy}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={14} /> Delete selected
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={bulkBusy}
            className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={14} /> Delete all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {enquiries.map((enquiry) => {
          const name = `${enquiry.first_name} ${enquiry.last_name}`
          const isChecked = selected.has(enquiry.id)
          return (
            <div
              key={enquiry.id}
              className={`bg-white rounded-xl border p-5 transition-colors ${isChecked ? 'border-[#1a2744] ring-1 ring-[#1a2744]/30' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOne(enquiry.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1a2744] focus:ring-[#1a2744] shrink-0"
                  aria-label={`Select enquiry from ${name}`}
                />
                <div className="flex-1 min-w-0 flex items-start justify-between gap-4 flex-wrap">
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
