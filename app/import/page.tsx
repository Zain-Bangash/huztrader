import { ImportQuoteForm } from '@/components/import/ImportQuoteForm'
import { CheckCircle2, Ship, FileCheck, Wrench, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Import A Car From Japan',
  description: 'We source, ship, and comply Japanese vehicles to Australian standards. Get a free import quote today.',
}

const processSteps = [
  {
    icon: Search,
    step: '01',
    title: 'You Tell Us What You Want',
    desc: 'Share your budget, preferred make/model, colour, and timeline. We source options from Japan specifically for you.',
  },
  {
    icon: CheckCircle2,
    step: '02',
    title: 'We Source & Secure Your Car',
    desc: 'Our team accesses major Japanese auctions and dealer networks to find the best match at the best price.',
  },
  {
    icon: Ship,
    step: '03',
    title: 'Shipping & Customs',
    desc: 'We manage all shipping logistics, Australian customs clearance, quarantine inspection, and documentation.',
  },
  {
    icon: FileCheck,
    step: '04',
    title: 'Compliance Certification',
    desc: 'Your vehicle is assessed and modified as needed to meet Australian Design Rules (ADRs) and receives its compliance plate.',
  },
  {
    icon: Wrench,
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

export default function ImportPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-3">Japanese Import Specialists</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-2xl">
            Import Your Dream Car From Japan
          </h1>
          <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
            We source, ship, comply, and register Japanese vehicles to Australian standards. Access thousands of models not available locally.
          </p>
        </div>
      </section>

      {/* Why import */}
      <section className="py-14 bg-white" id="how-we-import">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-3">Why Import?</p>
              <h2 className="text-3xl font-bold text-[#1a2744] mb-4">Better Cars, Better Prices</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Japan has one of the world&apos;s best used car markets. Strict roadworthy laws and high turnover mean low-mileage, well-maintained vehicles are available at prices well below the Australian market.
              </p>
              <ul className="space-y-3">
                {whyImport.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <CheckCircle2 size={17} className="text-[#e8b84b] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#f4f5f7] rounded-2xl p-8">
              <h3 className="font-bold text-[#1a2744] mb-1">What&apos;s included in our service?</h3>
              <p className="text-sm text-gray-500 mb-5">Full end-to-end import management</p>
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
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-[#1a2744] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-[#e8b84b]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-14 bg-[#f4f5f7]" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">The Process</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">From Japan To Your Driveway</h2>
            <p className="text-gray-500 mt-2">Typically 6–10 weeks from enquiry to delivery</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-xl p-5 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-[#e8b84b]/20 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#e8b84b]" />
                </div>
                <div className="absolute top-4 right-4 text-gray-200 font-black text-2xl leading-none">{step}</div>
                <h3 className="font-bold text-[#1a2744] text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section className="py-14 bg-white" id="quote">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-2">Free Quote</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Get Your Import Quote</h2>
            <p className="text-gray-500 mt-2">Tell us what you want and we&apos;ll come back with a full landed & complied cost</p>
          </div>
          <ImportQuoteForm />
        </div>
      </section>
    </>
  )
}
