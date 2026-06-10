import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CarGallery } from '@/components/cars/CarGallery'
import { EnquireForm } from '@/components/cars/EnquireForm'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMileage } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

async function getCar(slug: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('slug', slug)
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const car = await getCar(slug)
  if (!car) return { title: 'Car Not Found' }
  return {
    title: `${car.year} ${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`,
    description: car.description ?? `${car.year} ${car.make} ${car.model} for sale. ${formatPrice(car.price)} drive away.`,
  }
}

export default async function CarDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const car = await getCar(slug)
  if (!car) notFound()

  const carLabel = `${car.year} ${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`

  const specs = [
    { label: 'Year', value: car.year?.toString() },
    { label: 'Body Type', value: car.body_type },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuel_type },
    { label: 'Mileage', value: formatMileage(car.mileage) },
    { label: 'Colour', value: car.colour },
    { label: 'VIN', value: car.vin, mono: true },
    { label: 'Stock #', value: car.stock_number, mono: true },
  ].filter((s) => s.value && s.value !== '—')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 lg:pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <Link href="/cars" className="inline-flex items-center gap-1.5 text-[#6E7480] hover:text-ink-800 transition-colors">
          <ArrowLeft size={15} strokeWidth={1.5} />
          All cars
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-[#6E7480] truncate">{carLabel}</span>
      </div>

      {/* Title block — above the gallery */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6E7480] mb-1.5 tabular-nums">{car.year}</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="font-display text-3xl sm:text-[40px] font-bold text-ink-800 leading-tight">
            {car.make} {car.model}
            {car.variant && <span className="font-semibold text-[#6E7480]"> {car.variant}</span>}
          </h1>
          <div className="flex gap-2 flex-wrap pt-2">
            {car.status !== 'for_sale' && (
              <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'}>
                {car.status === 'sold' ? 'Sold' : 'Reserved'}
              </Badge>
            )}
            {car.is_import && <Badge variant="import">Fresh Import</Badge>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Left */}
        <div>
          <CarGallery images={car.images ?? []} alt={carLabel} />

          {/* Spec sheet */}
          {specs.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-card p-6">
              <h2 className="font-display text-lg font-semibold text-ink-800 mb-4">Vehicle Details</h2>
              <dl className="grid sm:grid-cols-2 gap-x-10">
                {specs.map(({ label, value, mono }) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-gray-100 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                    <dt className="text-[13px] text-[#6E7480] shrink-0">{label}</dt>
                    <dd className={`text-[15px] font-semibold text-ink-800 text-right tabular-nums break-all ${mono ? 'font-mono font-medium text-sm' : ''}`}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Description */}
          {car.description && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold text-ink-800 mb-3">About This Car</h2>
              <div className="text-gray-600 text-base leading-[1.7] whitespace-pre-line max-w-[65ch]">
                {car.description}
              </div>
            </div>
          )}
        </div>

        {/* Right — sticky enquire panel */}
        <div>
          <div className="sticky top-24" id="enquire">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-[11px] text-[#6E7480] uppercase tracking-wider mb-1">Drive Away</p>
                <p className="font-display text-4xl font-bold text-ink-800 tabular-nums">{formatPrice(car.price)}</p>
              </div>

              {car.status === 'for_sale' ? (
                <>
                  <h2 className="font-display font-semibold text-ink-800 mb-1">Ask About This Car</h2>
                  <p className="text-[13px] text-[#6E7480] mb-4">{carLabel} — enquire below</p>
                  <EnquireForm carId={car.id} carLabel={carLabel} />
                </>
              ) : (
                <div className="bg-ink-800 rounded-lg p-6 text-center">
                  <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'} className="mb-3">
                    {car.status === 'sold' ? 'Sold' : 'Reserved'}
                  </Badge>
                  <p className="text-white font-display font-semibold">
                    This one&apos;s gone — but we can find you another.
                  </p>
                  <Link href="/contact" className="mt-4 block">
                    <button className="w-full bg-gold-500 text-ink-900 py-2.5 rounded-md text-sm font-semibold hover:bg-gold-600 transition-colors">
                      Contact Us
                    </button>
                  </Link>
                  <Link href="/cars" className="mt-3 inline-block text-sm text-white/70 hover:text-white transition-colors">
                    Browse available cars
                  </Link>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="mt-4 bg-mist rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Prefer to call?</p>
              <a href="tel:1300000000" className="font-display text-ink-800 font-bold text-xl hover:text-ink-700 transition-colors tabular-nums">
                1300 000 000
              </a>
              <p className="text-xs text-gray-400 mt-0.5">Mon–Fri 9:30am–5:30pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar — display only, anchors to #enquire */}
      {car.status === 'for_sale' && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[#6E7480]">Drive Away</p>
            <p className="font-display text-lg font-bold text-ink-800 tabular-nums leading-tight">{formatPrice(car.price)}</p>
          </div>
          <a
            href="#enquire"
            className="shrink-0 bg-gold-500 text-ink-900 text-sm font-semibold px-6 py-3 rounded-md hover:bg-gold-600 transition-colors"
          >
            Enquire
          </a>
        </div>
      )}
    </div>
  )
}
