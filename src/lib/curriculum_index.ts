// Larose Christian Academy — full K-12 curriculum index.
// Combines all part files into one array for the /curriculum page.

import { CURRICULUM_PART1 } from './curriculum'
import { CURRICULUM_PART2 } from './curriculum_part2'
import { CURRICULUM_PART2b } from './curriculum_part2b'
import { CURRICULUM_PART2c } from './curriculum_part2c'
import { CURRICULUM_PART3a } from './curriculum_part3a'
import { CURRICULUM_PART3b_9_10 } from './curriculum_part3b'
import { CURRICULUM_PART3c } from './curriculum_part3c'
import type { GradeCurriculum } from './curriculum'

// Full K-12. Each grade = a full academic year (6 subjects, 4 quarters).
export const ALL_GRADES: GradeCurriculum[] = [
  ...CURRICULUM_PART1, // K, 1
  ...CURRICULUM_PART2, // 2, 3
  ...CURRICULUM_PART2b, // 4, 5
  ...CURRICULUM_PART2c, // 6
  ...CURRICULUM_PART3a, // 7, 8
  ...CURRICULUM_PART3b_9_10, // 9, 10
  ...CURRICULUM_PART3c, // 11, 12
]

export function getGradeCurriculum(num: number): GradeCurriculum | undefined {
  return ALL_GRADES.find((g) => g.gradeNum === num)
}

export const GRADE_LABELS = ALL_GRADES.map((g) => ({ num: g.gradeNum, label: g.grade }))
