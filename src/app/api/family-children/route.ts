// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com']

/**
 * GET /api/family-children?enrollmentId=xxx
 * Returns every child in the same family group as the given enrollment
 * (used by the enroll success page to show one church-form link per child).
 * 🔒 SECURITY: requires login AND ownership — a parent can only see their OWN
 * family's children, never another family's. Admins may see any.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
    }

    // 🔒 Must be logged in
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: enrollment, error: enrollErr } = await admin
      .from('enrollments')
      .select('id, family_group_id, student_first_name, student_last_name, student_grade, email')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (enrollErr || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    // 🔒 Ownership check: the caller must be the enrolled parent, or an admin
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
    const isOwner = enrollment.email?.toLowerCase() === user.email.toLowerCase().trim()
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'You can only view your own family' }, { status: 403 })
    }

    let children = [enrollment]
    if (enrollment.family_group_id) {
      const { data: siblings, error: sibErr } = await admin
        .from('enrollments')
        .select('id, family_group_id, student_first_name, student_last_name, student_grade')
        .eq('family_group_id', enrollment.family_group_id)
        .order('created_at', { ascending: true })
      if (!sibErr && siblings && siblings.length > 0) {
        children = siblings
      }
    }

    return NextResponse.json({
      children: children.map((c) => ({
        id: c.id,
        name: `${c.student_first_name} ${c.student_last_name}`.trim(),
        grade: c.student_grade,
      })),
    })
  } catch (err) {
    console.error('Family children lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
