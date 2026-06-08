import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CarGallery } from '@/components/cars/CarGallery'
import { EnquireForm } from '@/components/cars/EnquireForm'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Fuel, Settings2, Gauge, Car, Palette, Hash, Calendar, ArrowLeft } from 'lucide-react'
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
    { icon: Calendar, label: 'Year', value: car.year?.toString() },
    { icon: Car, label: 'Body Type', value: car.body_type },
    { icon: Settings2, label: 'Transmission', value: car.transmission },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type },
    { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
    { icon: Palette, label: 'Colour', value: car.colour },
    { icon: Hash, label: 'VIN', value: car.vin },
    { icon: Hash, label: 'Stock #', value: car.stock_number },
  ].filter((s) => s.value && s.value !== '—')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2744] mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to Cars
      </Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Left */}
        <div>
          {/* Gallery */}
          <CarGallery images={car.images ?? []} alt={carLabel} />

          {/* Car info */}
          <div className="mt-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <div>
                {car.stock_number && (
                  <p className="text-xs text-gray-400 mb-1">Stock #{car.stock_number}</p>
                )}
                <h1 className="text-3xl font-bold text-[#1a2744]">{carLabel}</h1>
              </div>
              <div className="flex gap-2 flex-wrap">
                {car.status !== 'for_sale' && (
                  <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'}>
                    {car.status === 'sold' ? 'Sold' : 'Reserved'}
                  </Badge>
                )}
                {car.is_import && <Badge variant="import">Import</Badge>}
              </div>
            </div>

            <div className="text-3xl font-bold text-[#e8b84b] mt-1">
              {formatPrice(car.price)}
              <span className="text-base font-normal text-gray-400 ml-2">Drive Away</span>
            </div>

            {/* Specs grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Icon size={13} />
                    <span className="text-xs">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a2744]">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#1a2744] mb-3">About This Car</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {car.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — sticky enquire panel */}
        <div>
          <div className="sticky top-24" id="enquire">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Drive Away Price</p>
                <p className="text-3xl font-bold text-[#1a2744]">{formatPrice(car.price)}</p>
              </div>

              {car.status === 'for_sale' ? (
                <>
                  <h2 className="font-bold text-[#1a2744] mb-4">Enquire About This Car</h2>
                  <EnquireForm carId={car.id} carLabel={carLabel} />
                </>
              ) : (
                <div className="text-center py-6">
                  <Badge variant={car.status === 'sold' ? 'sold' : 'reserved'} className="text-sm px-3 py-1 mb-3">
                    {car.status === 'sold' ? 'This car has been sold' : 'Currently reserved'}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-2">
                    Interested in something similar?
                  </p>
                  <Link href="/contact" className="mt-3 block">
                    <button className="w-full bg-[#1a2744] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#243561] transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="mt-4 bg-[#f4f5f7] rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Prefer to call?</p>
              <a href="tel:1300000000" className="text-[#1a2744] font-bold text-lg hover:text-[#e8b84b] transition-colors">
                1300 000 000
              </a>
              <p className="text-xs text-gray-400 mt-0.5">Mon–Fri 9:30am–5:30pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
