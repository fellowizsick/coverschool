import { type ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface LegalPageLayoutProps {
  icon: LucideIcon
  title: string
  subtitle: string
  children: ReactNode
}

export default function LegalPageLayout({ icon: Icon, title, subtitle, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur-sm">
            <Icon className="h-4 w-4" />
            Legal
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            {subtitle}
          </p>
          <p className="mt-2 text-sm text-emerald-300/60">Last updated: June 28, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-emerald max-w-none">
          {children}
        </div>
      </section>
    </div>
  )
}
