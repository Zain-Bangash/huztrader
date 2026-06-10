import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sold' | 'reserved' | 'import'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider',
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-signal-red text-white': variant === 'sold',
          'bg-gold-500 text-ink-900': variant === 'reserved',
          'border border-gray-400 text-gray-600 bg-white/80': variant === 'import',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
