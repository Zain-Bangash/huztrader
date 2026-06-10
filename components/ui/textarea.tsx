import { cn } from '@/lib/utils'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full rounded-md border-0 bg-[#F1F2F0] px-3.5 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-[1.5px] focus:ring-[#111B2E] disabled:opacity-50 resize-none',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
export { Textarea }
