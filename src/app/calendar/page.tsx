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

// 🎨 Fun pastel colors per day (rotates)
const DAY_COLORS = ['from-pink-400 to-rose-400', 'from-violet-400 to-purple-400', 'from-sky-400 to-blue-400', 'from-emerald-400 to-green-400', 'from-amber-400 to-orange-400']

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      if (res.status === 401) {
        router.replace('/login?redirect=/calendar')
        return
      }
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setEvents(data.events || [])
    } catch {
      setError('Could not load events. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    ;(async () => {
      try {
        const a = await fetch('/api/auth/user', { credentials: 'include' })
        if (!a.ok) {
          router.replace('/login?redirect=/calendar')
          return
        }
        const u = await a.json()
        const email = u?.user?.email || ''
        setUserEmail(email)
        const admins = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com']
        setIsAdmin(admins.includes(email.toLowerCase()))
        if (admins.includes(email.toLowerCase())) setFAudience('school')
        setLoading(false)
      } catch {
        router.replace('/login?redirect=/calendar')
      }
    })()
  }, [router])

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

  const addEvent = async () => {
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
    if (!window.confirm('Delete this event?')) return
    try {
      await fetch(`/api/calendar-events?id=${id}`, { method: 'DELETE', credentials: 'include' })
      await loadEvents()
    } catch {
      setError('Failed to delete event')
    }
  }

  const canDelete = (e: CalendarEvent) =>
    isAdmin || e.created_by?.toLowerCase() === (userEmail || '').toLowerCase()

  return (
    <div className="min-h-screen">
      {/* 🎨 Fun Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-pink-300/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/3 top-4 h-20 w-20 animate-bounce-soft rounded-full bg-yellow-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            <CalendarDays className="mr-1 inline h-4 w-4" /> Our School Calendar
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            What&apos;s happening at LCA?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
            Holidays, events, and family moments — all in one happy place.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => setShowAdd(true)}
              variant="gold"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Event
            </Button>
            <Link href="/parent">
              <Button size="lg" variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10">
                Back to Parent Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {MONTHS[viewMonth]} {viewYear}
            <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" /> {events.length} event{events.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <Button variant="outline" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day-of-week header */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {DOW.map((d) => (
            <div key={d} className="text-center text-xs font-bold uppercase tracking-wide text-gray-400">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {grid.map((day, i) => {
            if (day === null) return <div key={`e${i}`} className="min-h-[110px] rounded-2xl bg-gray-50/50" />
            const key = dateStr(viewYear, viewMonth, day)
            const dayEvents = eventsByDay[key] || []
            const colorIdx = (day + viewMonth) % DAY_COLORS.length
            return (
              <div
                key={key}
                className={`min-h-[110px] rounded-2xl border p-2 transition-all hover:shadow-lg ${
                  isToday(day)
                    ? 'border-fuchsia-400 bg-gradient-to-br from-fuchsia-50 to-purple-50 ring-2 ring-fuchsia-300'
                    : 'border-gray-100 bg-white hover:-translate-y-0.5'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      isToday(day) ? 'bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="rounded-full bg-purple-100 px-1.5 text-[10px] font-bold text-purple-600">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={`group relative rounded-lg px-1.5 py-1 text-[10px] font-semibold leading-tight text-white shadow-sm ${
                        e.audience === 'school'
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
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
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] font-semibold text-gray-400">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" /> School event (everyone sees)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" /> Your family event (private)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gray-400" /> Family events are only visible to your family
          </span>
        </div>

        {/* Upcoming events list */}
        <h3 className="mb-4 mt-10 flex items-center gap-2 text-xl font-bold text-gray-900">
          <PartyPopper className="h-5 w-5 text-fuchsia-500" /> Upcoming
        </h3>
        {events.filter((e) => e.event_date >= today.toISOString().slice(0, 10)).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No upcoming events yet. Add one to get the party started!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events
              .filter((e) => e.event_date >= today.toISOString().slice(0, 10))
              .slice(0, 10)
              .map((e) => {
                const d = new Date(e.event_date + 'T00:00:00')
                return (
                  <Card key={e.id} fun={e.audience === 'school' ? 'blue' : 'green'}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-md ${
                          e.audience === 'school'
                            ? 'bg-gradient-to-br from-indigo-500 to-blue-500'
                            : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        }`}
                      >
                        <span className="text-lg leading-none font-bold">{d.getDate()}</span>
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

        <div className="mt-10 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 p-4 text-xs text-gray-500">
          <p>
            <School className="mr-1 inline h-3.5 w-3.5 text-purple-500" />
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
                <Plus className="h-5 w-5 text-fuchsia-500" /> Add Event
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Description (optional)</label>
                <textarea
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  rows={2}
                  placeholder="What should families know?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
                <input
                  type="date"
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">End time</label>
                  <input
                    type="time"
                    value={fEnd}
                    onChange={(e) => setFEnd(e.target.value)}
                    disabled={fAllDay}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={fAllDay}
                  onChange={(e) => setFAllDay(e.target.checked)}
                  className="h-4 w-4 rounded accent-fuchsia-500"
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
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-500 hover:border-indigo-200'
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
