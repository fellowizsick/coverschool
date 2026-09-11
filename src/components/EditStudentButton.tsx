'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, AlertTriangle } from 'lucide-react'
import EditStudentPanel, { type EditableStudent } from '@/components/EditStudentPanel'

/**
 * An "Edit" button that can be dropped into a SERVER component (2026-09-11).
 *
 * WHY THIS EXISTS — Mom could not find how to edit a student or add their birthday.
 * The edit feature was real, but it lived ONLY on the roster page (/dashboard/students) as a
 * small grey pencil icon. Her actual path was: admin Overview -> "All Enrollments" -> click a
 * student -> this profile page, which had NO edit affordance at all. Dead end.
 *
 * Putting the same button here means editing is available wherever she already is, not only on
 * the one page she never found.
 */
export default function EditStudentButton({
  student,
  className,
}: {
  student: EditableStudent
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Same rule as the roster: no birthday, or a birthday that can't be a school-age child's,
  // means the admin should fix it. (Cash enrollments taken before the form had real labels
  // saved the enrollment date as the DOB.)
  const dobRaw = (student.student_dob ?? '').slice(0, 10)
  const dobLooksWrong = (() => {
    if (!dobRaw) return false
    const d = new Date(dobRaw + 'T00:00:00')
    if (isNaN(d.getTime())) return true
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    const m = now.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
    return age < 3 || age > 100 || d > now
  })()
  const needsDob = !dobRaw || dobLooksWrong

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Edit this student's details, including their date of birth"
        className={
          className ??
          `inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
            needsDob
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              : 'border-gray-300 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
          }`
        }
      >
        {needsDob ? <AlertTriangle className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        {needsDob ? 'Edit / add birthday' : 'Edit student'}
      </button>

      {open && (
        <EditStudentPanel
          student={student}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false)
            // Re-render the server component so the page shows the new details immediately.
            router.refresh()
          }}
        />
      )}
    </>
  )
}
