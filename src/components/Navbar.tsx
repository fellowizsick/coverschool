'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { NAV_LINKS, SCHOOL_CONFIG } from '@/lib/constants'
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdTimer = useRef<NodeJS.Timeout | null>(null)
  const progressTimer = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Secret admin long-press: hold the graduation cap emblem for 3 seconds
  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    if (progressTimer.current) {
      clearInterval(progressTimer.current)
      progressTimer.current = null
    }
    setHoldProgress(0)
  }, [])

  const startHold = useCallback(() => {
    cancelHold()
    let progress = 0
    progressTimer.current = setInterval(() => {
      progress += 3.33 // ~30 updates over 3 seconds
      if (progress >= 100) {
        progress = 100
        clearInterval(progressTimer.current!)
        progressTimer.current = null
        clearTimeout(holdTimer.current!)
        holdTimer.current = null
        setHoldProgress(0)
        router.push('/login?redirect=/dashboard/students')
        return
      }
      setHoldProgress(progress)
    }, 100)
    holdTimer.current = setTimeout(() => {
      // Safety: if the interval didn't fire
      cancelHold()
      router.push('/login?redirect=/dashboard/students')
    }, 3100)
  }, [cancelHold, router])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent'
      }`}
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo with secret admin long-press (hold 3s) */}
          <div className="group flex shrink-0 items-center gap-3">
            <div
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-amber-400 text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 group-hover:shadow-emerald-900/30 group-hover:scale-110 group-hover:rotate-3 cursor-pointer select-none overflow-hidden md:h-14 md:w-14"
              onMouseDown={() => startHold()}
              onMouseUp={() => cancelHold()}
              onMouseLeave={() => cancelHold()}
              onTouchStart={() => startHold()}
              onTouchEnd={() => cancelHold()}
              onTouchCancel={() => cancelHold()}
              onClick={() => router.push('/')}
            >
              <GraduationCap className="h-5 w-5 relative z-10 md:h-7 md:w-7" />
              {/* Progress ring */}
              {holdProgress > 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-100"
                  style={{ height: `${holdProgress}%` }}
                />
              )}
            </div>
            <Link href="/" className="flex flex-col">
              <span className={`font-heading text-base font-bold leading-tight transition-colors duration-300 md:text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                {SCHOOL_CONFIG.name}
              </span>
              <span className={`text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 md:text-xs ${scrolled ? 'text-emerald-700/80' : 'text-emerald-100/75'}`}>
                Alabama Church School · Est. 2024
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 2xl:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              const isEnroll = link.highlight

              if (isEnroll) {
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      size="sm"
                      variant="gold"
                      className={`ml-1.5 ${isActive ? 'ring-2 ring-amber-300 ring-offset-2' : ''}`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {link.label}
                    </Button>
                  </Link>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-all duration-200 group ${
                    isActive
                      ? scrolled
                        ? 'text-emerald-700 bg-emerald-50 shadow-sm'
                        : 'text-white bg-white/15 shadow-sm'
                      : scrolled
                        ? 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 hover:shadow-sm'
                        : 'text-white/90 hover:text-white hover:bg-white/10 hover:shadow-sm'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  )}
                  {!isActive && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative z-50 rounded-xl p-2.5 transition-all duration-200 ${
              isOpen
                ? 'bg-emerald-100 text-emerald-700'
                : scrolled
                  ? 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
            } 2xl:hidden`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gradient-to-br from-black/30 to-emerald-900/20 backdrop-blur-sm 2xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Nav Panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-72 transform overflow-y-auto border-l border-gray-100 bg-white/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out 2xl:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-4 pt-2">
          <span className="text-sm font-medium text-gray-400">☰ Menu</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 text-xs font-bold">
            ✦
          </div>
        </div>
        <nav className="space-y-1 px-4 pb-28">
          {NAV_LINKS.filter((link) => !link.highlight).map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 border border-emerald-100'
                      : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700 hover:pl-5'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Enroll CTA pinned at the bottom of the menu */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link href="/enroll" onClick={() => setIsOpen(false)} className="block">
            <Button size="lg" variant="gold" className="w-full text-base shadow-xl shadow-amber-500/25">
              <Sparkles className="h-4 w-4" />
              Enroll Now
            </Button>
          </Link>
          <p className="pointer-events-none mt-3 text-center text-xs text-gray-400">
            ✦ {SCHOOL_CONFIG.name} ✦
          </p>
        </div>
      </div>
    </header>
  )
}
