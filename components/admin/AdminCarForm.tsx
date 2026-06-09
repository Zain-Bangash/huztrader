'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Car } from '@/lib/types'

const schema = z.object({
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  variant: z.string().optional(),
  year: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(1980).max(2030)),
  status: z.enum(['for_sale', 'sold', 'reserved']),
  price: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().optional()),
  mileage: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().optional()),
  body_type: z.string().optional(),
  transmission: z.string().optional(),
  fuel_type: z.string().optional(),
  colour: z.string().optional(),
  vin: z.string().optional(),
  stock_number: z.string().optional(),
  description: z.string().optional(),
})

type FormData = z.output<typeof schema>

interface AdminCarFormProps {
  car?: Car
  mode: 'create' | 'edit'
}

export function AdminCarForm({ car, mode }: AdminCarFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(car?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: car ? {
      make: car.make, model: car.model, variant: car.variant ?? '', year: car.year,
      status: car.status, price: car.price, mileage: car.mileage,
      body_type: car.body_type ?? '', transmission: car.transmission ?? '',
      fuel_type: car.fuel_type ?? '', colour: car.colour ?? '', vin: car.vin ?? '',
      stock_number: car.stock_number ?? '', description: car.description ?? '',
    } : { status: 'for_sale', year: new Date().getFullYear() },
  })

  const uploadImages = async (files: FileList) => {
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('car-images').upload(path, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('car-images').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url))

  const onSubmit = async (data: FormData) => {
    setError('')
    setSaving(true)
    try {
      const payload = { ...data, images }
      const url = mode === 'create' ? '/api/admin/cars' : `/api/admin/cars/${car!.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to save')
      }
      router.refresh()
      router.push('/admin/cars')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save car')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-[#1a2744] mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Make *</label>
            <Input {...register('make')} placeholder="Toyota" />
            {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Model *</label>
            <Input {...register('model')} placeholder="Supra" />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Variant</label>
            <Input {...register('variant')} placeholder="GR Sport" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Year *</label>
            <Input {...register('year')} type="number" placeholder="2020" />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status *</label>
            <Select {...register('status')}>
              <option value="for_sale">For Sale</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Price (AUD)</label>
            <Input {...register('price')} type="number" placeholder="45000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mileage (km)</label>
            <Input {...register('mileage')} type="number" placeholder="35000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stock #</label>
            <Input {...register('stock_number')} placeholder="S001" />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-[#1a2744] mb-4">Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Body Type</label>
            <Select {...register('body_type')}>
              <option value="">Select...</option>
              {['Sedan', 'Coupe', 'SUV', 'Wagon', 'Hatchback', 'Van', 'Utility', 'Convertible'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Transmission</label>
            <Select {...register('transmission')}>
              <option value="">Select...</option>
              {['Automatic', 'Manual', 'CVT', 'Sports Automatic', 'Semi-Automatic'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fuel Type</label>
            <Select {...register('fuel_type')}>
              <option value="">Select...</option>
              {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Premium Unleaded', 'LPG'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Colour</label>
            <Input {...register('colour')} placeholder="Pearl White" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">VIN</label>
            <Input {...register('vin')} placeholder="JT..." />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-[#1a2744] mb-4">Description</h2>
        <Textarea {...register('description')} rows={5} placeholder="Describe the car — features, condition, service history, notable modifications..." />
      </div>

      {/* Photos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-[#1a2744] mb-4">Photos</h2>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((url, i) => (
              <div key={url} className="relative w-24 h-18 rounded-lg overflow-hidden border border-gray-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="w-24 h-18 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1a2744] text-white text-[9px] text-center py-0.5">
                    Main photo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#1a2744] transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && uploadImages(e.target.files)}
          />
          {uploading ? (
            <>
              <Loader2 size={28} className="text-[#1a2744] animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Upload size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — first photo becomes main image</p>
            </>
          )}
        </label>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/cars')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={saving || uploading} className="flex-1">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : mode === 'create' ? 'Add Car' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
