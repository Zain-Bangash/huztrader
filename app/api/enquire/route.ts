import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? ''

function buildEmailHtml(data: Record<string, unknown>, type: string): string {
  const typeLabel = type === 'car_quote' ? 'Car Enquiry' : type === 'import_quote' ? 'Import Quote Request' : 'General Contact'
  const rows = Object.entries(data)
    .filter(([k]) => !['type', 'car_id'].includes(k))
    .map(([k, v]) => {
      if (!v || (Array.isArray(v) && v.length === 0)) return ''
      const label = k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const value = Array.isArray(v) ? v.join(', ') : String(v)
      return `<tr><td style="padding:8px 12px;background:#f9fafb;font-size:13px;color:#6b7280;width:40%">${label}</td><td style="padding:8px 12px;font-size:13px;color:#111827">${value}</td></tr>`
    })
    .filter(Boolean)

  return `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1a2744;padding:24px 32px">
        <h1 style="color:#e8b84b;margin:0;font-size:20px">${typeLabel}</h1>
        <p style="color:#9ca3af;margin:4px 0 0;font-size:13px">New enquiry received from your website</p>
      </div>
      <div style="padding:24px 32px;background:#fff">
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          ${rows.join('')}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#9ca3af">
          Received ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} AEST
        </p>
      </div>
    </div>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, car_id, first_name, last_name, email, phone, message, department,
      budget, location, timeline, make_model, contact_pref, preferred_time } = body

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase
    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('enquiries').insert({
      type: type ?? 'general',
      car_id: car_id ?? null,
      department,
      first_name,
      last_name,
      email,
      phone: phone ?? null,
      message: message ?? null,
      budget: budget ?? null,
      location: location ?? null,
      contact_pref: contact_pref ?? null,
      preferred_time: preferred_time ?? null,
    })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
    }

    // Send email to owner
    if (OWNER_EMAIL && process.env.RESEND_API_KEY) {
      const typeLabel = type === 'car_quote' ? 'Car Enquiry' : type === 'import_quote' ? 'Import Quote Request' : 'General Contact'

      const ownerResult = await resend.emails.send({
        from: 'HuzTrader Website <onboarding@resend.dev>',
        to: OWNER_EMAIL,
        subject: `New ${typeLabel} from ${first_name} ${last_name}`,
        html: buildEmailHtml(body, type),
        replyTo: email,
      })

      if (ownerResult.error) {
        console.error('Resend owner email error:', ownerResult.error)
      } else {
        console.log('Owner email sent:', ownerResult.data?.id)
      }

      // Confirmation email to visitor
      const visitorResult = await resend.emails.send({
        from: 'HuzTrader <onboarding@resend.dev>',
        to: email,
        subject: `Thanks for your enquiry, ${first_name}!`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto">
            <div style="background:#1a2744;padding:24px 32px">
              <h1 style="color:#e8b84b;margin:0;font-size:20px">Thanks, ${first_name}!</h1>
            </div>
            <div style="padding:24px 32px;background:#fff;color:#374151">
              <p>We&apos;ve received your enquiry and will get back to you within 1 business day.</p>
              <p>If you need to reach us urgently, call us on <strong>+61 406 799 727</strong>.</p>
              <p style="color:#9ca3af;font-size:12px;margin-top:24px">Huz Trader</p>
            </div>
          </div>
        `,
      })

      if (visitorResult.error) {
        console.error('Resend visitor email error:', visitorResult.error)
      }
    } else {
      console.warn('Email not sent — OWNER_EMAIL or RESEND_API_KEY missing')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
