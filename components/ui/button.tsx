'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[#1a2744] text-white hover:bg-[#243561] focus-visible:ring-[#1a2744]': variant === 'primary',
            'border border-[#1a2744] text-[#1a2744] hover:bg-[#1a2744] hover:text-white': variant === 'outline',
            'text-[#1a2744] hover:bg-gray-100': variant === 'ghost',
            'bg-[#e8b84b] text-[#0f1117] hover:bg-[#d4a53a] focus-visible:ring-[#e8b84b]': variant === 'accent',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            'text-sm px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2': size === 'md',
            'text-base px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
export { Button }
