import { createClient } from '@/lib/supabase/server'
import { ImportCatalogueGrid } from '@/components/import/ImportCatalogueGrid'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Car } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Import Car Catalogue — SEVS Eligible Vehicles',
  description: 'Browse all SEVS-eligible Japanese vehicles we can import to Australia. Filter by fuel type, make, and model.',
}

async function getImportCars(): Promise<Car[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('is_import', true)
      .eq('status', 'for_sale')
      .order('make', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function ImportCataloguePage() {
  const cars = await getImportCars()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/import"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2744] mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Import Service
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">
          SEVS Eligible Vehicles
        </p>
        <h1 className="text-4xl font-bold text-[#1a2744]">Cars We Can Import</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Browse all {cars.length} vehicles eligible for import to Australia under the Specialist and Enthusiast Vehicle Scheme (SEVS).
          See something you like? We&apos;ll source, ship, comply, and register it for you.
        </p>

        {/* CTA strip */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/import#quote"
            className="inline-flex items-center gap-2 bg-[#e8b84b] text-[#0f1a33] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#d4a53a] transition-colors"
          >
            Get a Free Import Quote
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-[#1a2744] text-[#1a2744] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Full searchable grid */}
      <ImportCatalogueGrid cars={cars} />
    </div>
  )
}
