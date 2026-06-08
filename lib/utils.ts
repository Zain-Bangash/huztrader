import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price?: number): string {
  if (!price) return 'POA'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(km?: number): string {
  if (!km) return '—'
  return new Intl.NumberFormat('en-AU').format(km) + ' km'
}

export function generateSlug(make: string, model: string, year: number, stockNumber?: string): string {
  const base = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (stockNumber) return `${base}-${stockNumber.toLowerCase()}`
  return `${base}-${Date.now()}`
}
