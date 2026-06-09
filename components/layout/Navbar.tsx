'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Cars For Sale', href: '/cars' },
  {
    label: 'Import A Car',
    href: '/import',
    children: [
      { label: 'Browse All Cars', href: '/cars' },
      { label: 'How We Import', href: '/import#how-we-import' },
      { label: 'Import Process', href: '/import#process' },
      { label: 'Get A Quote', href: '/import#quote' },
    ],
  },
  { label: 'Recently Sold', href: '/recently-sold' },
  { label: 'Contact Us', href: '/contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  return (
    <header className="bg-[#1a2744] text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-[#0f1a33] py-1.5 px-4 text-xs text-gray-300 flex justify-end items-center gap-4 hidden sm:flex">
        <a href="tel:1300000000" className="flex items-center gap-1 hover:text-[#e8b84b] transition-colors">
          <Phone size={12} />
          1300 000 000
        </a>
        <span>Mon–Fri 9:30am–5:30pm · Sat–Sun by Appointment</span>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-[#e8b84b] rounded-md flex items-center justify-center">
            <span className="text-[#1a2744] font-black text-lg leading-none">A</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-white text-base tracking-tight">YOUR DEALER</span>
            <span className="text-[10px] text-[#e8b84b] tracking-widest uppercase">Premium Automotive</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href} className="relative group">
              {link.children ? (
                <>
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-[#e8b84b] transition-colors rounded-md hover:bg-white/5"
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  {/* Dropdown */}
                  <div
                    className={cn(
                      'absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-100 py-1 transition-all',
                      dropdownOpen === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                    )}
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a2744]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-[#e8b84b] transition-colors rounded-md hover:bg-white/5 block"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-[#e8b84b] text-[#0f1117] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#d4a53a] transition-colors"
          >
            Get A Quote
          </Link>
          <button
            className="lg:hidden p-2 text-gray-200 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#1a2744] px-4 py-3">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className="block py-2.5 text-sm text-gray-200 hover:text-[#e8b84b] font-medium border-b border-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-2 pl-4 text-sm text-gray-400 hover:text-[#e8b84b]"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <Link
            href="/contact"
            className="mt-3 block bg-[#e8b84b] text-[#0f1117] text-sm font-semibold px-4 py-2.5 rounded-md text-center"
            onClick={() => setMobileOpen(false)}
          >
            Get A Quote
          </Link>
        </div>
      )}
    </header>
  )
}
