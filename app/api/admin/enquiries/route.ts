import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Bulk delete: { all: true } removes every enquiry, { ids: [...] } removes those rows.
export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { ids, all } = (await request.json().catch(() => ({}))) as { ids?: string[]; all?: boolean }
    const supabase = getServiceClient()

    if (all) {
      // Match every real row (all UUIDs are non-zero)
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const { error } = await supabase.from('enquiries').delete().in('id', ids)
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'No enquiries specified' }, { status: 400 })
  } catch (err) {
    console.error('Bulk delete enquiries error:', err)
    return NextResponse.json({ error: 'Failed to delete enquiries' }, { status: 500 })
  }
}
