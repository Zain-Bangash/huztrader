'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Cars For Sale', href: '/cars' },
  {
    label: 'Import A Car',
    href: '/import',
    children: [
      { label: 'Browse All Cars', href: '/cars', desc: 'Our full inventory' },
      { label: 'How We Import', href: '/import#how-we-import', desc: 'Our process explained' },
      { label: 'Import Process', href: '/import#process', desc: 'From Japan to your driveway' },
      { label: 'Get A Quote', href: '/import#quote', desc: 'Free landed cost estimate' },
    ],
  },
  { label: 'Recently Sold', href: '/recently-sold' },
  { label: 'Contact Us', href: '/contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropdownOpen(label)
  }

  const closeDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setDropdownOpen(null), 150)
  }

  return (
    <header className="bg-[#111B2E] text-white sticky top-0 z-50 border-b border-white/10">
      {/* Top bar */}
      <div className="bg-[#0B1220] py-1.5 px-4 text-xs text-gray-300 justify-end items-center gap-4 hidden sm:flex">
        <a href="tel:+61406799727" className="flex items-center gap-1 hover:text-white transition-colors tabular-nums">
          <Phone size={12} strokeWidth={1.5} />
          +61 406 799 727
        </a>
        <span>Mon–Fri 9:30am–5:30pm · Sat–Sun by Appointment</span>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        {/* Logo — one-line wordmark */}
        <Link href="/" className="shrink-0">
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            HuzTrader<span className="text-[#C9A227]">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center self-stretch">
          {navLinks.map((link) => (
            <li key={link.href} className="relative flex">
              {link.children ? (
                <div
                  className="flex"
                  onMouseEnter={() => openDropdown(link.label)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1 px-4 text-sm font-medium transition-colors border-b-2 -mb-px',
                      isActive(link.href)
                        ? 'text-white border-[#C9A227]'
                        : 'text-white/75 border-transparent hover:text-white hover:border-[#C9A227]'
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                  {/* Dropdown */}
                  <div
                    className={cn(
                      'absolute top-full left-0 w-64 bg-[#111B2E] rounded-lg border border-white/10 shadow-xl py-2 transition-all',
                      dropdownOpen === link.label
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-1'
                    )}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 hover:bg-white/5 transition-colors"
                        onClick={() => setDropdownOpen(null)}
                      >
                        <span className="block text-sm font-medium text-white">{child.label}</span>
                        <span className="block text-xs text-white/50 mt-0.5">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center px-4 text-sm font-medium transition-colors border-b-2 -mb-px',
                    isActive(link.href)
                      ? 'text-white border-[#C9A227]'
                      : 'text-white/75 border-transparent hover:text-white hover:border-[#C9A227]'
                  )}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA + mobile controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-[#C9A227] text-[#0B1220] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#B38D1F] transition-colors"
          >
            Get A Quote
          </Link>
          {/* Mobile phone button — phone is otherwise hidden below sm */}
          <a
            href="tel:+61406799727"
            className="sm:hidden p-2 text-gray-200 hover:text-white"
            aria-label="Call us"
          >
            <Phone size={20} strokeWidth={1.5} />
          </a>
          <button
            className="lg:hidden p-2 text-gray-200 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#111B2E] px-4 py-4">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'block py-3.5 text-base font-medium border-b border-white/5',
                  isActive(link.href) ? 'text-white' : 'text-white/85 hover:text-white'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-2.5 pl-4 text-sm text-white/60 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-4 flex gap-3">
            <Link
              href="/contact"
              className="flex-1 bg-[#C9A227] text-[#0B1220] text-sm font-semibold px-4 py-3 rounded-md text-center"
              onClick={() => setMobileOpen(false)}
            >
              Get A Quote
            </Link>
            <a
              href="tel:+61406799727"
              className="flex-1 inline-flex items-center justify-center gap-2 border-[1.5px] border-white/30 text-white text-sm font-semibold px-4 py-3 rounded-md"
            >
              <Phone size={15} strokeWidth={1.5} />
              Call Us
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
