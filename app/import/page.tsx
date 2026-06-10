import { createClient } from '@/lib/supabase/server'
import { ImportQuoteForm } from '@/components/import/ImportQuoteForm'
import { ImportCatalogueGrid } from '@/components/import/ImportCatalogueGrid'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Car } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getPreviewCars(): Promise<Car[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'for_sale')
      .order('created_at', { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  title: 'Import A Car From Japan',
  description: 'We source, ship, and comply Japanese vehicles to Australian standards. Get a free import quote today.',
}

const heroStats = [
  '6–10 weeks door-to-door',
  'Fixed landed quote',
  'ADR complied & registered',
]

const processSteps = [
  {
    step: '01',
    title: 'You Tell Us What You Want',
    desc: 'Share your budget, preferred make/model, colour, and timeline. We source options from Japan specifically for you.',
  },
  {
    step: '02',
    title: 'We Source & Secure Your Car',
    desc: 'Our team accesses major Japanese auctions and dealer networks to find the best match at the best price.',
  },
  {
    step: '03',
    title: 'Shipping & Customs',
    desc: 'We manage all shipping logistics, Australian customs clearance, quarantine inspection, and documentation.',
  },
  {
    step: '04',
    title: 'Compliance Certification',
    desc: 'Your vehicle is assessed and modified as needed to meet Australian Design Rules (ADRs) and receives its compliance plate.',
  },
  {
    step: '05',
    title: 'Roadworthy & Registration',
    desc: 'We complete a full inspection, service, and registration so you receive a fully road-ready, registered vehicle.',
  },
]

const whyImport = [
  'Access rare and JDM-only models not sold in Australia',
  'Significant savings vs. Australian new/used market',
  'Vehicles are typically better maintained in Japan',
  'Wide range of makes, models, and specifications',
  'We handle all the paperwork — you just drive away',
]

const whatHappensNext = [
  'We confirm your specs, budget, and timeline',
  'You get a full landed & complied cost breakdown',
  'You approve before we bid on anything',
]

export default async function ImportPage() {
  const importCars = await getPreviewCars()

  return (
    <>
      {/* Hero */}
      <section className="bg-[#111B2E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60 font-semibold text-xs uppercase tracking-[0.12em] mb-3">Japanese Import Specialists</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 max-w-2xl">
            Import Your Dream Car From Japan
          </h1>
          <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
            We source, ship, comply, and register Japanese vehicles to Australian standards. Access thousands of models not available locally.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {heroStats.map((s) => (
              <span key={s} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] text-white/80 tabular-nums">
                {s}
              </span>
            ))}
          </div>
          <Link href="#quote" className="mt-8 inline-block">
            <Button variant="accent" size="lg">Get A Quote</Button>
          </Link>
        </div>
      </section>

      {/* Why import */}
      <section className="py-14 lg:py-20" id="how-we-import">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#6E7480] font-semibold text-xs uppercase tracking-[0.12em] mb-3">Why Import?</p>
              <h2 className="font-display text-3xl font-semibold text-[#111B2E] mb-4">Better Cars, Better Prices</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Japan has one of the world&apos;s best used car markets. Strict roadworthy laws and high turnover mean low-mileage, well-maintained vehicles are available at prices well below the Australian market.
              </p>
              <ul className="space-y-3">
                {whyImport.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <CheckCircle2 size={17} strokeWidth={1.5} className="text-[#111B2E] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions — ink anchor panel */}
            <div className="bg-[#111B2E] rounded-xl p-8 border-t border-white/5">
              <h3 className="font-display font-semibold text-white mb-1">Every quote includes</h3>
              <p className="text-sm text-white/50 mb-5">Full end-to-end import management</p>
              <ul className="space-y-3">
                {[
                  'Japanese auction sourcing & bidding',
                  'Purchase & export documentation',
                  'International shipping & marine insurance',
                  'Australian customs & quarantine',
                  'Compliance engineering (ADR certification)',
                  'Roadworthy certificate',
                  'Vehicle registration',
                  'Delivery to your door',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 size={15} strokeWidth={1.5} className="text-white/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process — vertical timeline */}
      <section className="py-14 lg:py-20 bg-[#F1F2F0]" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#6E7480] font-semibold text-xs uppercase tracking-[0.12em] mb-2">The Process</p>
            <h2 className="font-display text-3xl font-semibold text-[#111B2E]">From Japan To Your Driveway</h2>
            <p className="text-gray-500 mt-2">Typically 6–10 weeks from enquiry to delivery</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ol className="relative ml-5 border-l border-[#C9A227]/40 space-y-10">
              {processSteps.map(({ step, title, desc }) => (
                <li key={step} className="relative pl-10">
                  <span className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center">
                    <span className="font-display text-[#111B2E] text-sm font-bold tabular-nums">{step}</span>
                  </span>
                  <h3 className="font-display font-semibold text-[#111B2E] text-base pt-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1.5 max-w-xl">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Car preview */}
      {importCars.length > 0 && (
        <section className="py-14 lg:py-20" id="catalogue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-[#6E7480] font-semibold text-xs uppercase tracking-[0.12em] mb-2">
                Available Vehicles
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#111B2E]">Recently Landed &amp; Available</h2>
              <p className="text-gray-500 mt-2">
                A sample of what&apos;s available — enquire on any vehicle and we&apos;ll get back to you.
              </p>
            </div>

            {/* 3-car preview — no search UI */}
            <ImportCatalogueGrid cars={importCars} preview={3} />

            <div className="mt-10 text-center">
              <Link href="/cars">
                <Button variant="outline" size="lg">View Full Car Catalogue →</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quote — two-column band */}
      <section className="py-14 lg:py-20 bg-[#F1F2F0]" id="quote">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[#6E7480] font-semibold text-xs uppercase tracking-[0.12em] mb-2">Free Quote</p>
              <h2 className="font-display text-3xl font-semibold text-[#111B2E]">Get Your Import Quote</h2>
              <p className="text-gray-500 mt-2 leading-relaxed">
                Tell us what you want and we&apos;ll come back with a full landed &amp; complied cost.
              </p>

              <div className="mt-8">
                <h3 className="font-display font-semibold text-[#111B2E] mb-4">What happens next</h3>
                <ol className="space-y-3">
                  {whatHappensNext.map((item, i) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-white shadow-card flex items-center justify-center shrink-0 font-display text-xs font-bold text-[#111B2E] tabular-nums">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500">Prefer to talk it through?</p>
                <a href="tel:1300000000" className="font-display text-xl font-bold text-[#111B2E] hover:text-[#1C2A45] transition-colors tabular-nums">
                  1300 000 000
                </a>
              </div>
            </div>

            <ImportQuoteForm />
          </div>
        </div>
      </section>
    </>
  )
}
