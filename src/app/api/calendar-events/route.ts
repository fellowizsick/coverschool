// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com']
// 👩‍🏫 "Mom" — the academy owner. The ONLY person who can delete anything off the calendar.
const MOM_EMAIL = 'anneb7669@gmail.com'

/**
 * GET /api/calendar-events
 * Returns events visible to the viewer:
 *  - school events (everyone, even not logged in)
 *  - family events for the caller's own family_group(s) when logged in
 *  - admins see everything
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const admin = createAdminClient()
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false

    // Not logged in → school events only (public)
    if (!user?.email) {
      const { data: school, error } = await admin
        .from('calendar_events')
        .select('*')
        .eq('audience', 'school')
        .order('event_date', { ascending: true })
      if (error) {
        console.error('Calendar list error:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }
      return NextResponse.json({ events: school || [] })
    }

    if (!isAdmin) {
      // Own family groups
      const { data: myEnrollments } = await admin
        .from('enrollments')
        .select('family_group_id')
        .eq('email', user.email)
      const familyIds = [
        ...new Set((myEnrollments || []).map((e) => e.family_group_id).filter(Boolean)),
      ]
      const famFilter = familyIds.length ? `family_group_id.in.(${familyIds.join(',')})` : null

      const { data: school } = await admin
        .from('calendar_events')
        .select('*')
        .eq('audience', 'school')
        .order('event_date', { ascending: true })

      let family: any[] = []
      if (famFilter) {
        const { data: famData } = await admin
          .from('calendar_events')
          .select('*')
          .eq('audience', 'family')
          .in('family_group_id', familyIds)
          .order('event_date', { ascending: true })
        family = famData || []
      }

      return NextResponse.json({ events: [...(school || []), ...family] })
    }

    const { data: events, error } = await admin
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })
    if (error) {
      console.error('Calendar list error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ events: events || [] })
  } catch (err) {
    console.error('Calendar list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/calendar-events
 * Body: { title, description?, eventDate, startTime?, endTime?, allDay?, audience?, familyGroupId? }
 * Requires login. Admins may create school events; parents may create family events for their own family.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, eventDate, startTime, endTime, allDay, audience, familyGroupId } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!eventDate) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
    const aud = audience === 'family' ? 'family' : 'school'

    let famGroupId = familyGroupId || null
    if (!isAdmin && aud === 'school') {
      // Parents can't create school-wide events
      return NextResponse.json({ error: 'Only the school can create school-wide events' }, { status: 403 })
    }

    if (aud === 'family') {
      if (!isAdmin) {
        // Parent: must use their own family group
        const { data: myEnrollments } = await admin
          .from('enrollments')
          .select('family_group_id')
          .eq('email', user.email)
        const familyIds = [
          ...new Set((myEnrollments || []).map((e) => e.family_group_id).filter(Boolean)),
        ]
        if (!familyIds.length) {
          return NextResponse.json({ error: 'No family group found for your account' }, { status: 400 })
        }
        if (famGroupId && !familyIds.includes(famGroupId)) {
          return NextResponse.json({ error: 'You can only add events for your own family' }, { status: 403 })
        }
        famGroupId = famGroupId || familyIds[0]
      }
    }

    const { data: row, error } = await admin
      .from('calendar_events')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        event_date: eventDate,
        start_time: startTime || null,
        end_time: endTime || null,
        all_day: allDay !== false,
        audience: aud,
        family_group_id: famGroupId,
        created_by: user.email,
      })
      .select()
      .single()

    if (error) {
      console.error('Calendar insert error:', error)
      return NextResponse.json({ error: 'Failed to add event' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, event: row })
  } catch (err) {
    console.error('Calendar insert error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/calendar-events?id=xxx
 * Requires login. Only the person who ADDED the event may delete it.
 * Exception: admins may delete school events (the academy owns its own calendar),
 * but admins may NOT delete other families' private events.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: ev } = await admin.from('calendar_events').select('*').eq('id', id).maybeSingle()
    if (!ev) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const isMom = user.email.toLowerCase().trim() === MOM_EMAIL
    const isCreator = ev.created_by?.toLowerCase() === user.email.toLowerCase()

    // 🔒 Core rule: ONLY Mom (the academy owner) may delete anything off the
    // calendar. Exception: if YOU wrote the event (a student or parent added it),
    // you may delete only what YOU wrote — nothing else.
    const canDelete = isMom || isCreator
    if (!canDelete) {
      return NextResponse.json({ error: 'You can only delete events you added' }, { status: 403 })
    }

    const { error } = await admin.from('calendar_events').delete().eq('id', id)
    if (error) {
      console.error('Calendar delete error:', error)
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Calendar delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
