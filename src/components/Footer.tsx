import Link from 'next/link'
import { SCHOOL_CONFIG, NAV_LINKS } from '@/lib/constants'
import { GraduationCap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Top decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white font-heading">
                  {SCHOOL_CONFIG.name}
                </span>
                <span className="block text-[10px] font-medium tracking-wide text-emerald-400/70 uppercase">
                  Alabama Church School
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Providing legal oversight, record-keeping, and support for homeschooling families since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500">→</span>
                <a href={`mailto:${SCHOOL_CONFIG.email}`} className="transition-colors hover:text-emerald-400">
                  {SCHOOL_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500">→</span>
                <span>{SCHOOL_CONFIG.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500">→</span>
                <span>{SCHOOL_CONFIG.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {SCHOOL_CONFIG.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500">
            Operated with <Heart className="h-3 w-3 text-red-400 fill-red-400/30" /> as a church school under Alabama law
          </p>
        </div>
      </div>
    </footer>
  )
}
