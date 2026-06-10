import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { type SelectHTMLAttributes, forwardRef } from 'react'

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          'flex h-12 w-full appearance-none rounded-md border-0 bg-[#F1F2F0] pl-3.5 pr-10 py-2 text-sm focus:outline-none focus:ring-[1.5px] focus:ring-[#111B2E] disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7480]"
      />
    </div>
  )
)
Select.displayName = 'Select'
export { Select }
