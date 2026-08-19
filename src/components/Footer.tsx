import Link from 'next/link'
import { SCHOOL_CONFIG, NAV_LINKS } from '@/lib/constants'
import { GraduationCap, Heart, Sparkles, Star } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-emerald-950 text-gray-300 overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 via-amber-400 to-transparent" />

      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-[0.03] bg-sparkles pointer-events-none" />

      <div className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-400 text-white shadow-lg animate-bounce-soft">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white font-heading">
                  {SCHOOL_CONFIG.name}
                </span>
                <span className="block text-[10px] font-medium tracking-wide bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent uppercase">
                  ✦ Alabama Church School
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Providing legal oversight, record-keeping, and support for homeschooling families since 2024.
            </p>
            {/* Fun tagline */}
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400/60">
              <Sparkles className="h-3 w-3" />
              <span>Homeschool with confidence ✨</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase">
              <span className="h-px flex-1 bg-emerald-800/50" />
              Quick Links
              <span className="h-px flex-1 bg-emerald-800/50" />
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-200 hover:text-emerald-400 hover:translate-x-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-600/0 group-hover:bg-emerald-500 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase">
              <span className="h-px flex-1 bg-emerald-800/50" />
              Legal
              <span className="h-px flex-1 bg-emerald-800/50" />
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-200 hover:text-emerald-400 hover:translate-x-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-600/0 group-hover:bg-emerald-500 transition-all duration-200" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-200 hover:text-emerald-400 hover:translate-x-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-600/0 group-hover:bg-emerald-500 transition-all duration-200" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-200 hover:text-emerald-400 hover:translate-x-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-600/0 group-hover:bg-emerald-500 transition-all duration-200" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase">
              <span className="h-px flex-1 bg-emerald-800/50" />
              Contact
              <span className="h-px flex-1 bg-emerald-800/50" />
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="group flex items-start gap-2 transition-all duration-200 hover:text-emerald-400">
                <span className="mt-0.5 text-emerald-500 group-hover:animate-wiggle">✉</span>
                <a href={`mailto:${SCHOOL_CONFIG.email}`} className="transition-colors break-all hover:text-emerald-400">
                  {SCHOOL_CONFIG.email}
                </a>
              </li>
              <li className="group flex items-start gap-2 transition-all duration-200 hover:text-emerald-400">
                <span className="mt-0.5 text-emerald-500 group-hover:animate-wiggle">📞</span>
                <span>{SCHOOL_CONFIG.phone}</span>
              </li>
              <li className="group flex items-start gap-2 transition-all duration-200 hover:text-emerald-400">
                <span className="mt-0.5 text-emerald-500 group-hover:animate-wiggle">📍</span>
                <span>{SCHOOL_CONFIG.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            &copy; {new Date().getFullYear()} {SCHOOL_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              Made with <Heart className="h-3 w-3 text-red-400 fill-red-400/30 animate-pop hover:fill-red-400" />
              for homeschool families
            </p>
            <div className="hidden sm:flex gap-0.5">
              {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
                <span key={i} className="text-[8px] text-emerald-600/40" style={{ animationDelay: `${i * 0.3}s` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
