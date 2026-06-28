'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NAV_LINKS, SCHOOL_CONFIG } from '@/lib/constants'
import { Menu, X, GraduationCap } from 'lucide-react'
import { Button } from './ui/Button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 group-hover:shadow-emerald-900/30 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-gray-900 font-heading">
                {SCHOOL_CONFIG.name}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-emerald-600 uppercase">
                Alabama Church School
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) =>
              link.highlight ? (
                <Link key={link.href} href={link.href}>
                  <Button size="sm" className="ml-2">
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:shadow-sm"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-emerald-50/50 hover:text-emerald-700 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Nav Panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-72 transform border-l border-gray-100 bg-white/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-end px-4">
          <span className="text-sm font-medium text-gray-400">Menu</span>
        </div>
        <nav className="space-y-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                link.highlight
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700 hover:pl-5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
