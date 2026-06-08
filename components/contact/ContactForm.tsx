'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'

const schema = z.object({
  department: z.string().min(1, 'Please select a department'),
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

type FormData = z.infer<typeof schema>

const DEPARTMENTS = [
  'Dealership — Cars For Sale',
  'Import a Vehicle',
  'Compliance Certification',
  'General Enquiry',
  'Other',
]

export function ContactForm() {
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
        body: JSON.stringify({ ...data, type: 'general' }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or call us.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-bold text-green-800 text-xl">Message Sent!</h3>
        <p className="text-green-700 mt-2">We&apos;ll be in touch within 1 business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
        <Select {...register('department')}>
          <option value="">Select department...</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
      </div>

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
        <Textarea {...register('message')} rows={5} placeholder="How can we help you?" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Message'}
      </Button>
    </form>
  )
}
