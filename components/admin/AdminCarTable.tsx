'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Edit2, Trash2, Car, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Car as CarType } from '@/lib/types'

interface AdminCarTableProps {
  cars: CarType[]
}

const STATUS_COLORS = {
  for_sale: 'bg-green-100 text-green-700',
  sold: 'bg-red-100 text-red-700',
  reserved: 'bg-yellow-100 text-yellow-700',
}
const STATUS_LABELS = { for_sale: 'For Sale', sold: 'Sold', reserved: 'Reserved' }

export function AdminCarTable({ cars }: AdminCarTableProps) {
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase()
    return (
      !q ||
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.year.toString().includes(q) ||
      c.stock_number?.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' })
      if (res.ok) window.location.reload()
      else alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="pl-8 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Car size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">{search ? 'No cars match your search' : 'No cars yet — add one above'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Km</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock #</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((car) => {
                const label = `${car.year} ${car.make} ${car.model}`
                return (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {car.images?.[0] ? (
                            <Image src={car.images[0]} alt={label} width={48} height={36} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car size={16} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#1a2744]">{label}</div>
                          {car.variant && <div className="text-xs text-gray-400">{car.variant}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[car.status]}`}>
                        {STATUS_LABELS[car.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatPrice(car.price)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatMileage(car.mileage)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{car.stock_number ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cars/${car.id}`}
                          className="p-1.5 rounded-md text-gray-400 hover:text-[#1a2744] hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id, label)}
                          disabled={deleting === car.id}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
