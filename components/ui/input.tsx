import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-12 w-full rounded-md border-0 bg-[#F1F2F0] px-3.5 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-[1.5px] focus:ring-[#111B2E] disabled:opacity-50 disabled:bg-gray-100',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'
export { Input }
