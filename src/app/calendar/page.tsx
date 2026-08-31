'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Sparkles,
  PartyPopper,
  Loader2,
  Lock,
  School,
  Home,
  Star,
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  all_day: boolean
  audience: 'school' | 'family'
  family_group_id: string | null
  created_by: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const EMOJI_BANK = ['🎉', '📚', '✏️', '🎨', '🎵', '⚽', '🌳', '🦃', '🎄', '❤️', '✝️', '🎆', '🍎', '🧪', '🌎', '🎓', '🎁', '🚌']

function emojiFor(title: string): string {
  const t = title.toLowerCase()
  const map: [RegExp, string][] = [
    [/christmas|holiday|break|winter/, '🎄'],
    [/thanksgiving|turkey/, '🦃'],
    [/easter|resurrect|good friday/, '✝️'],
    [/labor|memorial|independence|presidents|mlk|martin/, '🇺🇸'],
    [/new year/, '🎆'],
    [/valentine/, '❤️'],
    [/st\.? patrick|shamrock/, '🍀'],
    [/field trip|trip/, '🚌'],
    [/science|stem|lab/, '🧪'],
    [/art|music|choir/, '🎨'],
    [/sport|game|meet|pe|field day/, '⚽'],
    [/reading|book|library/, '📚'],
    [/graduation|last day/, '🎓'],
    [/first day|back to school/, '🍎'],
    [/party|celebration|spirit/, '🎉'],
    [/progress|report|picture/, '📸'],
  ]
  for (const [re, e] of map) if (re.test(t)) return e
  return EMOJI_BANK[Math.abs(title.length * 7) % EMOJI_BANK.length]
}

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMom, setIsMom] = useState(false)
  const [upcomingOpen, setUpcomingOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // How many event chips fit in a day cell (fewer on phones so the month fits on screen)
  const [maxShown, setMaxShown] = useState(5)
  useEffect(() => {
    const update = () => setMaxShown(window.innerWidth < 640 ? 2 : 5)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Form state
  const [fTitle, setFTitle] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fDate, setFDate] = useState(today.toISOString().slice(0, 10))
  const [fStart, setFStart] = useState('')
  const [fEnd, setFEnd] = useState('')
  const [fAllDay, setFAllDay] = useState(true)
  const [fAudience, setFAudience] = useState<'school' | 'family'>('family')

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar-events', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setEvents(data.events || [])
    } catch {
      setError('Could not load events. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const a = await fetch('/api/auth/user', { credentials: 'include' })
        if (a.ok) {
          const u = await a.json()
          const email = u?.user?.email || ''
          setUserEmail(email)
          setIsLoggedIn(!!email)
          const admins = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com']
          setIsAdmin(admins.includes(email.toLowerCase()))
          // 👩‍🏫 Mom = the academy owner — the only one who can delete anything.
          setIsMom(email.toLowerCase() === 'anneb7669@gmail.com')
          if (admins.includes(email.toLowerCase())) setFAudience('school')
        }
      } catch {
        // anonymous visitor — calendar is still viewable
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!loading) loadEvents()
  }, [loading, loadEvents])

  // Build month grid
  const grid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const startDay = first.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: (number | null)[] = Array(startDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    for (const e of events) {
      const key = e.event_date.slice(0, 10)
      ;(map[key] ||= []).push(e)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => (a.all_day === b.all_day ? 0 : a.all_day ? -1 : 1))
    return map
  }, [events])

  const dateStr = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const isToday = (d: number) => {
    const t = new Date()
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === d
  }

  const prevMonth = () => {
    setViewMonth((m) => (m === 0 ? (setViewYear((y) => y - 1), 11) : m - 1))
  }
  const nextMonth = () => {
    setViewMonth((m) => (m === 11 ? (setViewYear((y) => y + 1), 0) : m + 1))
  }

  const requireLogin = () => {
    router.push('/login?redirect=/calendar')
  }

  const handleAddClick = () => {
    if (!isLoggedIn) return requireLogin()
    setShowAdd(true)
  }

  const addEvent = async () => {
    if (!isLoggedIn) return requireLogin()
    if (!fTitle.trim()) {
      setError('Give your event a name!')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fTitle,
          description: fDesc,
          eventDate: fDate,
          startTime: fStart || null,
          endTime: fEnd || null,
          allDay: fAllDay,
          audience: fAudience,
        }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add event')
        return
      }
      setShowAdd(false)
      setFTitle('')
      setFDesc('')
      setFStart('')
      setFEnd('')
      setFAllDay(true)
      await loadEvents()
    } catch {
      setError('Failed to add event')
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id: string) => {
    if (!isLoggedIn) return requireLogin()
    if (!window.confirm('Delete this event?')) return
    try {
      const res = await fetch(`/api/calendar-events?id=${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to delete event')
        return
      }
      await loadEvents()
    } catch {
      setError('Failed to delete event')
    }
  }

  // 🔒 Delete rule: ONLY Mom (the academy owner) can delete anything off the
  // calendar. If you wrote an event yourself (student or parent), you may delete
  // only what YOU wrote — nothing else. Must be logged in (server enforces too).
  const canDelete = (e: CalendarEvent) => {
    if (!isLoggedIn) return false
    if (isMom) return true
    return e.created_by?.toLowerCase() === (userEmail || '').toLowerCase()
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* 🎨 Compact hero — keeps the calendar on screen.
          NOTE: pt-20 sm:pt-24 clears the FIXED navbar (80px). Without it the
          title bleeds up behind the transparent nav gradient (desktop bug
          reported 2026-08-08: "words behind the top words"). */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-700 px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8">
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-amber-300/15 blur-3xl [animation-delay:1s]" />
        <div className="mx-auto max-w-7xl text-center">
          <span className="mb-2 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
            <CalendarDays className="mr-1 inline h-4 w-4" /> Our School Calendar
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What&apos;s happening at LCA?
          </h1>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-emerald-100 sm:text-base">
            {isLoggedIn
              ? 'Holidays, events, and family moments — all in one happy place.'
              : 'School events are open to everyone. Log in to add your family\u2019s events.'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button onClick={handleAddClick} variant="gold" size="md">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
            <Link href="/parent">
              <Button size="md" variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10">
                Back to Parent Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col px-3 py-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-700">
            {error}
          </div>
        )}

        {!isLoggedIn && (
          <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 sm:text-sm">
            👀 You&apos;re viewing school events.{' '}
            <Link href="/login?redirect=/calendar" className="font-bold underline">
              Log in
            </Link>{' '}
            to add your family&apos;s events.
          </div>
        )}

        {/* Month navigation */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> {events.length} event{events.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day-of-week header */}
        <div className="mb-1 grid grid-cols-7 gap-1 sm:gap-2">
          {DOW.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid — stretches to fill the screen so the whole month is visible */}
        <div className="grid min-h-[420px] flex-1 grid-cols-7 grid-rows-6 gap-1 sm:min-h-[480px] sm:gap-2">
          {grid.map((day, i) => {
            if (day === null) return <div key={`e${i}`} className="min-h-0 rounded-xl bg-gray-50/50" />
            const key = dateStr(viewYear, viewMonth, day)
            const dayEvents = eventsByDay[key] || []
            return (
              <div
                key={key}
                className={`flex min-h-0 flex-col overflow-hidden rounded-xl border p-1 transition-all sm:p-1.5 ${
                  isToday(day)
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 ring-2 ring-emerald-300'
                    : 'border-gray-100 bg-white hover:shadow-md'
                }`}
              >
                <div className="mb-0.5 flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday(day) ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="rounded-full bg-emerald-100 px-1.5 text-[9px] font-bold text-emerald-600 sm:text-[10px]">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
                  {dayEvents.slice(0, maxShown).map((e) => (
                    <div
                      key={e.id}
                      className={`group relative rounded-md px-1 py-0.5 text-[9px] font-semibold leading-tight text-white sm:text-[10px] ${
                        e.audience === 'school'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      title={e.description || e.title}
                    >
                      <span className="mr-0.5">{emojiFor(e.title)}</span>
                      {e.title.length > 14 ? e.title.slice(0, 13) + '…' : e.title}
                      {canDelete(e) && (
                        <button
                          onClick={() => deleteEvent(e.id)}
                          className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white group-hover:flex"
                          aria-label="Delete event"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > maxShown && (
                    <div className="text-[9px] font-semibold text-gray-400 sm:text-[10px]">
                      +{dayEvents.length - maxShown} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-600 sm:text-sm">
          <span className="font-semibold text-gray-900">Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" /> School event (everyone sees)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" /> Your family event (private)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gray-400" /> Family events are only visible to your family
          </span>
        </div>

        {/* Upcoming events — dropdown, starts closed */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <button
            onClick={() => setUpcomingOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-emerald-50/60 sm:px-5"
            aria-expanded={upcomingOpen}
            aria-controls="upcoming-panel"
          >
            <span className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
              <PartyPopper className="h-5 w-5 text-emerald-500" /> Upcoming
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">
                {events.filter((e) => e.event_date >= today.toISOString().slice(0, 10)).length}
              </span>
            </span>
            <ChevronRight
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${upcomingOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {upcomingOpen && (
            <div id="upcoming-panel" className="border-t border-gray-100 p-4 sm:p-5">
              {events.filter((e) => e.event_date >= today.toISOString().slice(0, 10)).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500 sm:p-8">
                    No upcoming events yet. Add one to get the party started!
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {events
                    .filter((e) => e.event_date >= today.toISOString().slice(0, 10))
                    .slice(0, 10)
                    .map((e) => {
                      const d = new Date(e.event_date + 'T00:00:00')
                      return (
                        <Card key={e.id} fun={e.audience === 'school' ? 'blue' : 'green'}>
                          <CardContent className="flex items-center gap-4 p-3 sm:p-4">
                            <div
                              className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-md sm:h-14 sm:w-14 ${
                                e.audience === 'school'
                                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                  : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                              }`}
                            >
                              <span className="text-base leading-none font-bold sm:text-lg">{d.getDate()}</span>
                              <span className="text-[10px] uppercase">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                                <span className="text-lg">{emojiFor(e.title)}</span> {e.title}
                                {e.audience === 'family' && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                    <Home className="h-3 w-3" /> Family
                                  </span>
                                )}
                              </p>
                              {e.description && <p className="mt-0.5 truncate text-sm text-gray-500">{e.description}</p>}
                              {!e.all_day && e.start_time && (
                                <p className="mt-0.5 text-xs text-gray-400">
                                  🕐 {e.start_time}
                                  {e.end_time ? ` – ${e.end_time}` : ''}
                                </p>
                              )}
                            </div>
                            {canDelete(e) && (
                              <Button variant="ghost" size="sm" onClick={() => deleteEvent(e.id)} aria-label="Delete">
                                <Trash2 className="h-4 w-4 text-rose-400" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-4 text-xs text-gray-500">
          <p>
            <School className="mr-1 inline h-3.5 w-3.5 text-emerald-500" />
            <strong>School events</strong> are added by the academy and visible to every family.
            <Home className="mx-1 inline h-3.5 w-3.5 text-emerald-500" />
            <strong>Family events</strong> are private — only your family sees them. Holidays are
            pre-filled; the academy can add or adjust them anytime.
          </p>
        </div>
      </div>

      {/* ➕ Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Plus className="h-5 w-5 text-emerald-500" /> Add Event
              </h3>
              <button onClick={() => setShowAdd(false)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Event name *</label>
                <input
                  value={fTitle}
                  onChange={(e) => setFTitle(e.target.value)}
                  placeholder="e.g. Christmas Break, Field Trip"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Description (optional)</label>
                <textarea
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  rows={2}
                  placeholder="What should families know?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
                <input
                  type="date"
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Start time</label>
                  <input
                    type="time"
                    value={fStart}
                    onChange={(e) => setFStart(e.target.value)}
                    disabled={fAllDay}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">End time</label>
                  <input
                    type="time"
                    value={fEnd}
                    onChange={(e) => setFEnd(e.target.value)}
                    disabled={fAllDay}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={fAllDay}
                  onChange={(e) => setFAllDay(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                All day
              </label>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Who sees it?</label>
                <div className="grid grid-cols-2 gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setFAudience('school')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
                        fAudience === 'school'
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-500 hover:border-emerald-200'
                      }`}
                    >
                      <School className="h-4 w-4" /> School-wide
                    </button>
                  )}
                  <button
                    onClick={() => setFAudience('family')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
                      fAudience === 'family'
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-500 hover:border-emerald-200'
                    }`}
                  >
                    <Home className="h-4 w-4" /> My family
                  </button>
                </div>
                {!isAdmin && (
                  <p className="mt-1 text-xs text-gray-400">
                    Only the academy can post school-wide events. Your family events are private.
                  </p>
                )}
              </div>

              {saving ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…
                </Button>
              ) : (
                <Button onClick={addEvent} className="w-full" variant="gold">
                  <Star className="mr-2 h-4 w-4" /> Add to Calendar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
