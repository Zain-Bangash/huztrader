'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  budget: z.string().min(1, 'Please enter your budget'),
  location: z.string().min(1, 'Please select your state'),
  timeline: z.string().min(1, 'Please select a timeline'),
  make_model: z.string().optional(),
  contact_pref: z.array(z.string()).min(1, 'Select at least one contact method'),
  preferred_time: z.string().min(1, 'Please select a preferred time'),
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']
const TIMELINES = ['Immediately', 'Next few weeks', 'Next few months', "I'm just exploring"]
const CONTACT_PREFS = ['Phone Call', 'Text/SMS', 'Email', 'WhatsApp']
const TIMES = ['Morning (9am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–7pm)', 'Any time']

const steps = ['Your Budget', 'Contact Details', 'Preferences']

export function ImportQuoteForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [contactPrefs, setContactPrefs] = useState<string[]>([])

  const {
    register, handleSubmit, trigger, setValue, formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contact_pref: [] },
  })

  const togglePref = (pref: string) => {
    const updated = contactPrefs.includes(pref)
      ? contactPrefs.filter((p) => p !== pref)
      : [...contactPrefs, pref]
    setContactPrefs(updated)
    setValue('contact_pref', updated, { shouldValidate: true })
  }

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ['budget', 'location', 'timeline'],
      ['first_name', 'last_name', 'email'],
      ['contact_pref', 'preferred_time'],
    ]
    const valid = await trigger(fieldsPerStep[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitError('')
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'import_quote' }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-bold text-green-800 text-xl">Quote Request Received!</h3>
        <p className="text-green-700 mt-2">We&apos;ll review your requirements and get back to you within 1 business day.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#1a2744] text-white' : 'bg-gray-200 text-gray-500'
            )}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-[#1a2744]' : 'text-gray-400')}>
              {label}
            </span>
            {i < steps.length - 1 && <div className={cn('flex-1 h-0.5', i < step ? 'bg-green-500' : 'bg-gray-200')} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Budget */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1a2744]">What are you looking for?</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Budget (AUD) *</label>
              <Input {...register('budget')} placeholder="e.g. $40,000" />
              {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your State *</label>
              <Select {...register('location')}>
                <option value="">Select state...</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">When do you need the car? *</label>
              <Select {...register('timeline')}>
                <option value="">Select timeline...</option>
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Make/Model (optional)</label>
              <Input {...register('make_model')} placeholder="e.g. Toyota Supra, Nissan Skyline..." />
            </div>
          </div>
        )}

        {/* Step 1: Contact */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1a2744]">Your contact details</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional details (optional)</label>
              <Textarea {...register('message')} rows={3} placeholder="Any specific requirements, colour preferences, modifications..." />
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-[#1a2744]">How should we contact you?</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred contact method *</label>
              <div className="grid grid-cols-2 gap-2">
                {CONTACT_PREFS.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePref(pref)}
                    className={cn(
                      'py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors text-left',
                      contactPrefs.includes(pref)
                        ? 'bg-[#1a2744] text-white border-[#1a2744]'
                        : 'border-gray-200 text-gray-600 hover:border-[#1a2744]'
                    )}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              {errors.contact_pref && <p className="text-red-500 text-xs mt-1">{errors.contact_pref.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best time to contact *</label>
              <Select {...register('preferred_time')}>
                <option value="">Select time...</option>
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              {errors.preferred_time && <p className="text-red-500 text-xs mt-1">{errors.preferred_time.message}</p>}
            </div>
          </div>
        )}

        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3 mt-4">{submitError}</p>
        )}

        {/* Nav buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
              <ChevronLeft size={16} /> Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button type="button" variant="primary" onClick={nextStep} className="flex-1">
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button type="submit" variant="accent" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Submit Quote Request'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
