import { ContactForm } from '@/components/contact/ContactForm'
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team. Ask about cars, imports, or anything else.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero — compact */}
      <section className="bg-[#111B2E] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold">Talk to us.</h1>
          <p className="text-gray-300 mt-2 max-w-lg">
            Questions about a car, an import quote, or anything else — we&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-start">
            {/* Info — first on mobile, left on desktop */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="font-display text-lg font-semibold text-[#111B2E] mb-5">Dealership</h2>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={16} strokeWidth={1.5} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600">123 Your Street, Your Suburb VIC 3000</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=123+Your+Street+Your+Suburb+VIC+3000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[#111B2E] font-medium hover:underline underline-offset-2"
                    >
                      Get directions
                      <ExternalLink size={12} strokeWidth={1.5} />
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} strokeWidth={1.5} className="text-gray-400 shrink-0 mt-1.5" />
                  <a href="tel:1300000000" className="font-display text-[22px] font-bold text-[#111B2E] hover:text-[#1C2A45] transition-colors tabular-nums">
                    1300 000 000
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                  <a href="mailto:contact@yourdomain.com" className="text-gray-600 hover:text-[#111B2E] transition-colors">
                    contact@yourdomain.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} strokeWidth={1.5} className="text-gray-400 shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-gray-600">
                    <span className="font-medium text-[#111B2E]">Mon–Fri</span>
                    <span>9:30am–5:30pm</span>
                    <span className="font-medium text-[#111B2E]">Sat–Sun</span>
                    <span>By appointment</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#111B2E] mb-6">Send A Message</h2>
              <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
                <ContactForm />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We typically reply within one business day. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
