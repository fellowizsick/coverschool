-- Grace Cover School - Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up your database

-- 1. Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_first_name TEXT NOT NULL,
  parent_last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  student_first_name TEXT NOT NULL,
  student_last_name TEXT NOT NULL,
  student_grade TEXT NOT NULL,
  student_dob TEXT NOT NULL,
  previous_school TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  stripe_customer_id TEXT DEFAULT '',
  stripe_subscription_id TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 2. Students table (for tracking active students)
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  dob TEXT,
  enrollment_id UUID REFERENCES enrollments(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'graduated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 3. Profiles table (for admin user roles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('admin', 'parent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 5. Subjects / Courses
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- 6. Report card grades
CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  term TEXT NOT NULL,
  school_year TEXT NOT NULL,
  grade TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- 7. Report cards
CREATE TABLE IF NOT EXISTS report_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  term TEXT NOT NULL,
  school_year TEXT NOT NULL,
  issued_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins can see everything
CREATE POLICY "Admins can read all enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins can update enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Parents can only see their own enrollments (by email)
CREATE POLICY "Parents can read own enrollments"
  ON enrollments FOR SELECT
  USING (email = auth.email());

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Insert profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'parent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set the first user as admin (run after creating your first user)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
