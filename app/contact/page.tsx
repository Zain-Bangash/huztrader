import { ContactForm } from '@/components/contact/ContactForm'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team. Ask about cars, imports, or anything else.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#e8b84b] font-semibold text-sm uppercase tracking-wider mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300 mt-2 max-w-lg">
            Questions about a car, import quote, or anything else? Our team is happy to help.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1a2744] mb-6">Send Us A Message</h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-[#f4f5f7] rounded-xl p-6">
                <h3 className="font-bold text-[#1a2744] mb-4">Dealership</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2.5 text-gray-600">
                    <MapPin size={16} className="text-[#e8b84b] shrink-0 mt-0.5" />
                    123 Your Street, Your Suburb VIC 3000
                  </li>
                  <li className="flex items-center gap-2.5 text-gray-600">
                    <Phone size={16} className="text-[#e8b84b] shrink-0" />
                    <a href="tel:1300000000" className="hover:text-[#1a2744]">1300 000 000</a>
                  </li>
                  <li className="flex items-center gap-2.5 text-gray-600">
                    <Mail size={16} className="text-[#e8b84b] shrink-0" />
                    <a href="mailto:contact@yourdomain.com" className="hover:text-[#1a2744]">contact@yourdomain.com</a>
                  </li>
                  <li className="flex items-start gap-2.5 text-gray-600">
                    <Clock size={16} className="text-[#e8b84b] shrink-0 mt-0.5" />
                    <span>Mon–Fri: 9:30am–5:30pm<br />Sat–Sun: By Appointment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1a2744] text-white rounded-xl p-6">
                <h3 className="font-bold mb-2">Prefer to call?</h3>
                <p className="text-gray-300 text-sm mb-3">Speak directly with our team during business hours.</p>
                <a href="tel:1300000000" className="text-[#e8b84b] font-bold text-2xl hover:opacity-80 transition-opacity">
                  1300 000 000
                </a>
              </div>

              <div className="bg-[#f4f5f7] rounded-xl p-6 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Response time</p>
                <p>We typically respond to enquiries within 1 business day. For urgent matters, please call us directly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
