import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Share2, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#0f1a33] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#e8b84b] rounded-md flex items-center justify-center">
                <span className="text-[#1a2744] font-black text-lg">A</span>
              </div>
              <div>
                <div className="font-bold text-white text-base">YOUR DEALER</div>
                <div className="text-[10px] text-[#e8b84b] tracking-widest uppercase">Premium Automotive</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Family operated dealership specialising in quality used vehicles and Japanese car imports. Trusted by hundreds of happy customers.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e8b84b] hover:text-[#0f1a33] transition-colors text-gray-300">
                <Share2 size={15} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e8b84b] hover:text-[#0f1a33] transition-colors text-gray-300">
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Cars For Sale', '/cars'],
                ['Import A Car From Japan', '/import'],
                ['Recently Sold', '/recently-sold'],
                ['Contact Us', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#e8b84b] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Import */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Import A Car</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['How We Import', '/import#how-we-import'],
                ['Import Process', '/import#process'],
                ['Get Import Quote', '/import#quote'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#e8b84b] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#e8b84b] shrink-0 mt-0.5" />
                <span>123 Your Street, Your Suburb VIC 3000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#e8b84b] shrink-0" />
                <a href="tel:1300000000" className="hover:text-[#e8b84b] transition-colors">1300 000 000</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#e8b84b] shrink-0" />
                <a href="mailto:contact@yourdomain.com" className="hover:text-[#e8b84b] transition-colors">contact@yourdomain.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#e8b84b] shrink-0 mt-0.5" />
                <span>Mon–Fri 9:30am–5:30pm<br />Sat–Sun by Appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Your Dealer. All rights reserved.</span>
          <span>Built with Next.js · Hosted on Vercel</span>
        </div>
      </div>
    </footer>
  )
}
