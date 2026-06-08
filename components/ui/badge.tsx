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
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-red-100 text-red-700': variant === 'sold',
          'bg-yellow-100 text-yellow-700': variant === 'reserved',
          'bg-blue-100 text-blue-700': variant === 'import',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
