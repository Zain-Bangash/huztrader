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
            'bg-[#111B2E] text-white hover:bg-[#1C2A45] focus-visible:ring-[#111B2E]': variant === 'primary',
            'border-[1.5px] border-[#111B2E] text-[#111B2E] hover:bg-[#111B2E]/5 focus-visible:ring-[#111B2E]': variant === 'outline',
            'text-[#111B2E] hover:bg-gray-100': variant === 'ghost',
            'bg-[#C9A227] text-[#0B1220] font-semibold hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.14)] focus-visible:ring-[#C9A227]': variant === 'accent',
            'bg-[#B42318] text-white hover:bg-[#9A1E14]': variant === 'danger',
            'text-sm px-3 py-1.5 min-h-9': size === 'sm',
            'text-sm px-4 py-2 min-h-11': size === 'md',
            'text-base px-7 py-3 min-h-12': size === 'lg',
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
