import { AdminLoginForm } from '@/components/admin/AdminLoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#e8b84b] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-[#1a2744] font-black text-2xl">A</span>
          </div>
          <h1 className="text-white font-bold text-2xl">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">HuzTrader</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
