'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

type FormData = z.infer<typeof schema>

interface EnquireFormProps {
  carId: string
  carLabel: string
}

export function EnquireForm({ carId, carLabel }: EnquireFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'car_quote', car_id: carId }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or call us directly.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-green-800 text-lg">Enquiry Sent!</h3>
        <p className="text-green-700 text-sm mt-1">
          We&apos;ve received your enquiry about the {carLabel}. We&apos;ll be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <Input {...register('first_name')} placeholder="John" />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <Input {...register('last_name')} placeholder="Smith" />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <Input {...register('email')} type="email" placeholder="john@example.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <Input {...register('phone')} type="tel" placeholder="04xx xxx xxx" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <Textarea
          {...register('message')}
          rows={4}
          placeholder={`I'm interested in the ${carLabel}. Please contact me with more details...`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Enquiry'}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We respond within 1 business day. Your details are kept private.
      </p>
    </form>
  )
}
