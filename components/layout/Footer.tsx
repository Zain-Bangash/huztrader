import Link from 'next/link'
import { Phone, Mail, Clock } from 'lucide-react'

const exploreLinks = [
  ['Cars For Sale', '/cars'],
  ['Import A Car From Japan', '/import'],
  ['How We Import', '/import#how-we-import'],
  ['Import Process', '/import#process'],
  ['Get Import Quote', '/import#quote'],
  ['Recently Sold', '/recently-sold'],
  ['Contact Us', '/contact'],
]

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-300 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr] gap-10">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                HuzTrader<span className="text-[#C9A227]">.</span>
              </span>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">Premium Automotive</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Family operated dealership specialising in quality used vehicles and Japanese car imports. Trusted by hundreds of happy customers.
            </p>
            <a
              href="tel:+61406799727"
              className="mt-5 inline-block font-display text-2xl font-bold text-white hover:text-gray-200 transition-colors tabular-nums"
            >
              +61 406 799 727
            </a>
            <p className="text-sm mt-4 text-gray-400">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
              <span className="mx-2 text-gray-600">·</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.12em]">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.12em]">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                <a href="tel:+61406799727" className="hover:text-white transition-colors tabular-nums">+61 406 799 727</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                <a href="mailto:traders.huz@gmail.com" className="hover:text-white transition-colors">traders.huz@gmail.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} strokeWidth={1.5} className="text-gray-400 shrink-0 mt-0.5" />
                <span>Mon–Fri 9:30am–5:30pm<br />Sat–Sun by Appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} HuzTrader. All rights reserved.</span>
          <span>Licensed Motor Car Trader · LMCT 00000</span>
        </div>
      </div>
    </footer>
  )
}
