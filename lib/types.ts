export type CarStatus = 'for_sale' | 'sold' | 'reserved'
export type EnquiryType = 'general' | 'car_quote' | 'import_quote'

export interface Car {
  id: string
  slug: string
  status: CarStatus
  make: string
  model: string
  variant?: string
  year: number
  price?: number
  mileage?: number
  body_type?: string
  transmission?: string
  fuel_type?: string
  colour?: string
  vin?: string
  stock_number?: string
  description?: string
  is_import: boolean
  images: string[]
  created_at: string
  updated_at: string
}

export interface Enquiry {
  id: string
  type: EnquiryType
  car_id?: string
  department?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  message?: string
  budget?: string
  location?: string
  contact_pref?: string[]
  preferred_time?: string
  created_at: string
  car?: Car
}
