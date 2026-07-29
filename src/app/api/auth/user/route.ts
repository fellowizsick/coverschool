import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      },
    })
  } catch {
    return NextResponse.json({ user: null, error: 'Server error' }, { status: 500 })
  }
}
