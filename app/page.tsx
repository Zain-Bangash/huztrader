import Link from 'next/link'
import { ArrowRight, Shield, Clock, Award, Users, Car, CheckCircle2, Star } from 'lucide-react'
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
      .eq('is_import', false)
      .order('created_at', { ascending: false })
      .limit(6)
    return data ?? []
  } catch {
    return []
  }
}

const trustBadges = [
  { icon: Shield, label: 'Family Operated', sub: 'Over 10 Years Experience' },
  { icon: Award, label: 'Quality Assured', sub: 'Every car inspected' },
  { icon: Clock, label: 'Fast Turnaround', sub: 'Imports in 6–10 weeks' },
  { icon: Users, label: 'Happy Customers', sub: '500+ vehicles sold' },
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
      {/* Hero */}
      <section className="relative bg-[#1a2744] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744] via-[#243561] to-[#0f1a33]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e8b84b 0%, transparent 50%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#e8b84b]/20 border border-[#e8b84b]/30 rounded-full px-4 py-1.5 mb-6">
              <Star size={14} className="text-[#e8b84b]" />
              <span className="text-[#e8b84b] text-sm font-medium">Trusted Used Car Dealer &amp; Import Specialists</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your <span className="text-[#e8b84b]">Dream Car</span><br />
              Today
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Browse our quality used car inventory or let us import your dream car directly from Japan. Family operated with over 10 years experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars">
                <Button variant="accent" size="lg" className="gap-2">
                  Browse Cars For Sale
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/import">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white hover:text-[#1a2744]">
                  Import From Japan
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trustBadges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8b84b]/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#e8b84b]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{label}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">In Stock Now</p>
              <h2 className="text-3xl font-bold text-[#1a2744]">Cars For Sale</h2>
              <p className="text-gray-500 mt-1">Drive away today — no waiting, no importing required</p>
            </div>
            <Link href="/cars" className="hidden sm:flex items-center gap-1 text-[#1a2744] font-semibold text-sm hover:text-[#e8b84b] transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Car size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">New inventory coming soon</p>
              <p className="text-gray-400 text-sm mt-1">Check back shortly or contact us for availability</p>
              <Link href="/contact" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Get In Touch</Button>
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/cars">
              <Button variant="outline">View All Cars</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Import CTA */}
      <section className="py-16 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a2744] rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-3">Can&apos;t Find What You Want?</p>
                <h2 className="text-3xl font-bold text-white mb-4">
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
                      <CheckCircle2 size={16} className="text-[#e8b84b] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/import">
                  <Button variant="accent" size="lg">
                    Get Import Quote <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              {/* Steps */}
              <div className="bg-white/5 p-10 lg:p-14 border-t lg:border-t-0 lg:border-l border-white/10">
                <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">How It Works</h3>
                <div className="space-y-6">
                  {importSteps.map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#e8b84b]/20 border border-[#e8b84b]/40 flex items-center justify-center shrink-0">
                        <span className="text-[#e8b84b] text-xs font-bold">{step}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{title}</div>
                        <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1a2744] mb-3">Not Sure Where To Start?</h2>
          <p className="text-gray-500 mb-7 max-w-xl mx-auto">
            Our team is here to help. Whether you&apos;re buying, importing, or just browsing — reach out and we&apos;ll guide you.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">Contact Us Today</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
