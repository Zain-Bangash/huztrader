import Link from 'next/link'
import { ArrowRight, Car, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { CarCard } from '@/components/cars/CarCard'
import type { Car as CarType } from '@/lib/types'

async function getFeaturedCars(): Promise<CarType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'for_sale')
      .order('created_at', { ascending: false })
      .limit(6)
    return data ?? []
  } catch {
    return []
  }
}

const trustStats = [
  { stat: '500+', label: 'Vehicles sold' },
  { stat: '10+ Years', label: 'Family operated' },
  { stat: '6–10 Weeks', label: 'Import turnaround' },
  { stat: 'Every Car', label: 'Inspected & quality assured' },
]

const importSteps = [
  { step: '01', title: 'Tell Us What You Want', desc: 'Share your budget, preferred make/model, and timeline. We source the best options from Japan.' },
  { step: '02', title: 'We Source Your Car', desc: 'Our team finds the right vehicle at Japanese auctions and secures it at the best price.' },
  { step: '03', title: 'Shipping & Customs', desc: 'We handle all logistics — shipping, customs clearance, and quarantine inspection.' },
  { step: '04', title: 'Compliance & Registration', desc: 'Your car is fully complied to Australian standards and registered, ready to drive.' },
]

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <>
      {/* Hero — gradient fallback composition (photo upgrade pending owner asset, redesign.md §6) */}
      <section className="relative bg-ink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-900" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A227 0%, transparent 50%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <p className="text-white/60 font-semibold text-xs uppercase tracking-[0.12em] mb-5">
              Used Cars &amp; Japanese Imports — Family Run
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Find Your <span className="text-gold-500">Dream Car</span><br />
              Today
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Browse our quality used car inventory or let us import your dream car directly from Japan. Family operated with over 10 years experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars">
                <Button variant="accent" size="lg" className="gap-2">
                  Browse Cars For Sale
                  <ArrowRight size={18} strokeWidth={1.5} />
                </Button>
              </Link>
              <Link href="/import">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  Import From Japan
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust band — quiet stat row */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/10">
              {trustStats.map(({ stat, label }) => (
                <div key={label} className="lg:px-8 lg:first:pl-0">
                  <div className="font-display text-lg lg:text-xl font-semibold text-white tabular-nums">{stat}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#6E7480] font-semibold text-xs uppercase tracking-[0.12em] mb-2">In Stock Now</p>
            <h2 className="font-display text-3xl font-semibold text-ink-800">Cars For Sale</h2>
            <p className="text-gray-500 mt-1">Drive away today — no waiting, no importing required</p>
          </div>

          {featuredCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/cars">
                  <Button variant="outline" size="lg">View All Cars</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-card">
              <Car size={40} strokeWidth={1.5} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">New inventory coming soon</p>
              <p className="text-gray-400 text-sm mt-1">Check back shortly or contact us for availability</p>
              <Link href="/contact" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Get In Touch</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Import CTA — full-bleed dark band */}
      <section className="py-20 lg:py-24 bg-ink-800 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-white/60 font-semibold text-xs uppercase tracking-[0.12em] mb-3">Can&apos;t Find What You Want?</p>
              <h2 className="font-display text-3xl font-semibold text-white mb-4">
                We&apos;ll Import It From Japan
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Access thousands of Japanese vehicles not available locally. We handle everything from sourcing to compliance — you just drive away.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Access to major Japanese auctions',
                  'Full compliance & registration handled',
                  'Typically 6–10 weeks door to door',
                  'Transparent landed cost breakdown',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-gray-300 text-sm">
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-white/70 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/import">
                <Button variant="accent" size="lg">
                  Get Import Quote <ArrowRight size={16} strokeWidth={1.5} />
                </Button>
              </Link>
            </div>

            {/* Steps — vertical timeline with gold connecting line */}
            <div>
              <h3 className="text-white/60 font-semibold mb-8 text-xs uppercase tracking-[0.12em]">How It Works</h3>
              <ol className="relative ml-4 border-l border-gold-500/40 space-y-9">
                {importSteps.map(({ step, title, desc }) => (
                  <li key={step} className="relative pl-9">
                    <span className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-ink-800 border border-gold-500/60 flex items-center justify-center">
                      <span className="font-display text-gold-500 text-xs font-bold tabular-nums">{step}</span>
                    </span>
                    <div className="text-white font-medium text-sm pt-1.5">{title}</div>
                    <div className="text-gray-400 text-[13px] mt-1 leading-relaxed">{desc}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA — one line, one button */}
      <section className="py-16 bg-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-ink-800 mb-6">
            Not sure where to start? We&apos;re happy to help.
          </h2>
          <Link href="/contact">
            <Button variant="primary" size="lg">Contact Us Today</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
