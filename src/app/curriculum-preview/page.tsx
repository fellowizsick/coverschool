import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  GraduationCap, BookOpen, CheckCircle, Star, 
  BookText, Calculator, FlaskConical, Globe, 
  ScrollText, Heart, Sparkles, ArrowRight 
} from 'lucide-react'

const grades = [
  { label: 'Kindergarten', slug: 'k', age: '5-6', subjects: 6, tag: 'Foundations in faith, number, and wonder.' },
  { label: '1st Grade', slug: '1', age: '6-7', subjects: 6, tag: 'Building readers, writers, and thinkers.' },
  { label: '2nd Grade', slug: '2', age: '7-8', subjects: 6, tag: 'Growing skills, confidence, and curiosity.' },
  { label: '3rd Grade', slug: '3', age: '8-9', subjects: 6, tag: 'Strengthening foundations, exploring ideas.' },
  { label: '4th Grade', slug: null, age: '9-10', subjects: 6, tag: 'Deepening knowledge, expanding worldview.' },
  { label: '5th Grade', slug: null, age: '10-11', subjects: 6, tag: 'Preparing for middle school with confidence.' },
  { label: '6th Grade', slug: null, age: '11-12', subjects: 6, tag: 'Critical thinking meets core academics.' },
  { label: '7th Grade', slug: null, age: '12-13', subjects: 6, tag: 'Transitioning to deeper analysis.' },
  { label: '8th Grade', slug: null, age: '13-14', subjects: 6, tag: 'Building high school readiness.' },
  { label: '9th Grade', slug: null, age: '14-15', subjects: 6, tag: 'High school foundations with a Christian worldview.' },
  { label: '10th Grade', slug: null, age: '15-16', subjects: 6, tag: 'Advanced academics, deeper faith integration.' },
  { label: '11th Grade', slug: null, age: '16-17', subjects: 6, tag: 'College prep meets character development.' },
  { label: '12th Grade', slug: null, age: '17-18', subjects: 6, tag: 'Senior year — graduation, diploma, and beyond.' },
]

const subjects = [
  { icon: BookText, name: 'Mathematics', desc: 'Number sense through advanced math — counting to Algebra readiness, with hands-on activities.' },
  { icon: BookOpen, name: 'Language Arts', desc: 'Reading, writing, grammar, and composition. From phonics to research papers.' },
  { icon: ScrollText, name: 'Spelling & Word Origins', desc: 'Integrated spelling and etymology — building vocabulary through root words.' },
  { icon: FlaskConical, name: 'Science', desc: 'Exploring God\'s creation through observation, experiments, and scientific method.' },
  { icon: Globe, name: 'History & Geography', desc: 'World and American history through a Christian lens, with geography woven in.' },
  { icon: Heart, name: 'Bible & Character', desc: 'Scripture, theology, and character formation — the foundation of all learning.' },
]

const features = [
  { icon: Star, title: 'Self-Paced', desc: 'Lessons unlock in order — students progress at their own speed.' },
  { icon: CheckCircle, title: 'Auto-Graded', desc: 'Weekly tests and unit assessments give instant feedback.' },
  { icon: GraduationCap, title: 'Diploma Track', desc: 'Complete all 13 grades and earn a high school diploma.' },
  { icon: Sparkles, title: 'Christian Worldview', desc: 'Every subject taught from a biblical perspective.' },
]

export default async function CurriculumPreviewPage() {
  // Logged-in users should go to the real curriculum, not the marketing preview
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/curriculum')

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 mb-6">
            📚 Grades K-12
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">
            A Complete K-12 Christian Curriculum
          </h1>
          <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto mb-8">
            6 core subjects across 13 grades — each lesson designed to build knowledge, 
            character, and faith. Included with your Larose Christian Academy membership.
          </p>
          <Link href="/curriculum">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 text-base px-8 py-6 rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Your Journey
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center p-4">
              <f.icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="py-12 bg-white/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">6 Core Subjects Per Grade</h2>
          <p className="text-center text-gray-500 mb-10">Every grade covers the same subject areas, with depth increasing each year.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <Card key={s.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <s.icon className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Overview */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">All Grades, One Curriculum</h2>
        <p className="text-center text-gray-500 mb-10">13 grades &middot; 6 subjects each &middot; 936 lessons &middot; 1 diploma</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {grades.map((g) => {
            const card = (
              <Card key={g.label} className={`hover:border-emerald-300 transition-all ${g.slug ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{g.label}</h3>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{g.age}</span>
                  </div>
                  <p className="text-xs text-gray-500">{g.tag}</p>
                  <p className="text-xs text-gray-400 mt-2">{g.subjects} subjects &middot; 72 lessons</p>
                  {g.slug && (
                    <span className="inline-block mt-2 text-xs text-emerald-600 font-medium">
                      See full scope &rarr;
                    </span>
                  )}
                </CardContent>
              </Card>
            )
            return g.slug ? (
              <Link key={g.label} href={`/curriculum-preview/${g.slug}`}>
                {card}
              </Link>
            ) : (
              card
            )
          })}
        </div>
      </section>

      {/* Sample Lesson */}
      <section className="py-16 bg-emerald-50/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Sample Lesson</h2>
          <p className="text-center text-gray-500 mb-8">Kindergarten Mathematics — Counting 1 to 10</p>
          <Card className="border-emerald-200">
            <CardContent className="p-8">
              <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-2">Lesson Preview</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Counting 1 to 10</h3>
              <div className="prose prose-sm text-gray-600 space-y-3">
                <p>Numbers help us know how many of something we have. Today we will learn to count from 1 to 10!</p>
                <p>Let's start with our fingers. Hold up one finger. That is the number 1. Now hold up two fingers. That is 2. Keep going: 3, 4, 5, 6, 7, 8, 9, 10!</p>
                <p>Practice by counting things around you. Count your toys. Count the stairs. Count the apples in the kitchen. The more you count, the better you will get.</p>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs font-semibold text-amber-800 uppercase mb-2">Sample Quiz Question</p>
                <p className="text-sm text-amber-900">What number comes after 3?</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-sm text-gray-400">A) 2</span>
                  <span className="text-sm text-emerald-600 font-semibold">B) 4 ✓</span>
                  <span className="text-sm text-gray-400">C) 5</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">Over 900 more lessons like this across all 13 grades.</p>
            <Link href="/enroll">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl">
                🎓 Enroll Now — See the Full Curriculum
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-2xl mx-auto px-4">
        <GraduationCap className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Homeschool with Confidence?</h2>
        <p className="text-gray-500 mb-6">$45/month &middot; $75 annual registration &middot; All curriculum included</p>
        <Link href="/enroll">
          <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 text-lg px-10 py-4 rounded-xl font-semibold shadow-xl">
            ✨ Enroll Your Student
          </Button>
        </Link>
      </section>
    </div>
  )
}
