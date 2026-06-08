'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Car, Inbox, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Cars', href: '/admin/cars', icon: Car },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 bg-[#1a2744] text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e8b84b] rounded flex items-center justify-center">
            <span className="text-[#1a2744] font-black">A</span>
          </div>
          <div>
            <div className="font-bold text-sm">Admin Panel</div>
            <div className="text-[10px] text-gray-400">Your Dealer</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-[#e8b84b] text-[#1a2744]'
                : 'text-gray-300 hover:bg-white/10'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 mt-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <LayoutDashboard size={14} />
          View Site
        </Link>
      </div>
    </aside>
  )
}
