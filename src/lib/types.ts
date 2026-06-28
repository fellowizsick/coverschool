export interface SchoolConfig {
  name: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
  logo_url?: string
}

export interface StateInfo {
  code: string
  name: string
  status: 'available' | 'limited' | 'unavailable'
  notes?: string
}

export interface EnrollmentFormData {
  parent_first_name: string
  parent_last_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  student_first_name: string
  student_last_name: string
  student_grade: string
  student_dob: string
  previous_school?: string
  notes?: string
  agree_to_terms: boolean
}

export interface Enrollment extends EnrollmentFormData {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  family_id: string
  first_name: string
  last_name: string
  grade: string
  dob: string
  enrollment_date: string
  status: 'active' | 'withdrawn' | 'graduated'
}

export interface Family {
  id: string
  user_id: string
  parent_first_name: string
  parent_last_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'excused'
  notes?: string
}

export interface Subject {
  id: string
  name: string
  grade_level: string
}

export interface Grade {
  id: string
  student_id: string
  subject_id: string
  term: string
  school_year: string
  grade: string
  notes?: string
}

export interface ReportCard {
  id: string
  student_id: string
  term: string
  school_year: string
  issued_date: string
  grades: Grade[]
  attendance_summary?: {
    present: number
    absent: number
    excused: number
    total_days: number
  }
}
