// Map enrollment.student_grade ("3rd Grade", "Kindergarten") -> gradeNum (0..12)
export function gradeToNum(grade: string): number {
  if (!grade) return 0
  const g = grade.trim().toLowerCase()
  if (g === 'kindergarten' || g.startsWith('k')) return 0
  const m = g.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

export const GRADE_NUM_TO_LABEL: Record<number, string> = {
  0: 'Kindergarten',
  1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade', 4: '4th Grade',
  5: '5th Grade', 6: '6th Grade', 7: '7th Grade', 8: '8th Grade',
  9: '9th Grade', 10: '10th Grade', 11: '11th Grade', 12: '12th Grade',
}
