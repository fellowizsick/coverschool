import Link from 'next/link'

export default function CurriculumPage() {
  const resources = [
    {
      name: 'Khan Academy',
      url: 'https://www.khanacademy.org',
      description: 'Free world-class education for anyone anywhere. Math, science, history, and more — grade K through early college.',
      icon: '📚',
    },
    {
      name: 'Discovery K12',
      url: 'https://discoveryk12.com',
      description: 'Free, online secular homeschool curriculum for Pre-K to 12th grade. Complete with reading, writing, math, science, and social studies.',
      icon: '🔬',
    },
    {
      name: 'HomeTrail Planner',
      url: 'https://hometrail.net/free-homeschool-planner',
      description: 'Free digital homeschool planner — track lessons, schedules, progress, and multi-child management all in one place.',
      icon: '📋',
    },
    {
      name: 'ACT Test Prep',
      url: 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html',
      description: 'Free ACT practice tests, question of the day, prep guides, and tutoring \u2014 official resources from ACT.org.',
      icon: '🎯',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-4">
            <span>📖</span> Free Curriculum Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            Quality Learning Resources for Your Homeschool
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We provide access to proven, trusted educational platforms — all free to use alongside your LCA membership.
          </p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid gap-6">
          {resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-start gap-4"
            >
              <span className="text-4xl shrink-0">{r.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {r.name}
                  <span className="inline-block ml-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h3>
                <p className="text-gray-500 mt-1">{r.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <h3 className="font-semibold text-emerald-800 mb-2">How it works</h3>
          <p className="text-emerald-700 text-sm max-w-lg mx-auto">
            These resources are free and open to everyone. Use them alongside your LCA enrollment to build a complete education plan. Need help getting started? <Link href="/contact" className="underline font-medium">Contact us</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
