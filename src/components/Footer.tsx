import Link from 'next/link'
import { SCHOOL_CONFIG, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                G
              </div>
              <span className="text-lg font-bold text-gray-900">
                {SCHOOL_CONFIG.name}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {SCHOOL_CONFIG.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>{SCHOOL_CONFIG.email}</li>
              <li>{SCHOOL_CONFIG.phone}</li>
              <li>{SCHOOL_CONFIG.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {SCHOOL_CONFIG.name}. All rights
          reserved. Operated as a church school under Alabama law.
        </div>
      </div>
    </footer>
  )
}
