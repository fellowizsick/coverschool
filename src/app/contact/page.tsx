'use client'

import { useState, FormEvent } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { Mail, Phone, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykqplgw'
// 2026-08-08: Formspree DROPPED. Messages were lost (form ID owned by a different
// account). Now sends direct to the school Gmail via /api/contact (SMTP).
const CONTACT_API = '/api/contact'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      subject: String(data.get('subject') || ''),
      message: String(data.get('message') || ''),
    }

    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-[100dvh]">
      {/* 🎨 Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-700 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute -left-12 top-6 h-40 w-40 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-8 bottom-8 h-48 w-48 animate-float rounded-full bg-amber-300/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/2 top-4 h-20 w-20 animate-bounce-soft rounded-full bg-amber-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            📬 Get In Touch
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            Have questions? We&apos;d love to hear from you.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300" />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-center gap-2 text-center">
          <span className="emoji-badge">💌</span>
          <span className="text-sm font-medium text-gray-500">
            We typically respond within 24 hours
          </span>
          <span className="animate-wiggle text-lg">✨</span>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="animate-slide-up space-y-6">
            <Card fun="green">
              <CardContent className="space-y-6 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">{SCHOOL_CONFIG.email}</p>
                  </div>
                </div>
                <div className="divider-rainbow !h-[3px] !rounded-full !border-0 !bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300" />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">{SCHOOL_CONFIG.phone}</p>
                  </div>
                </div>
                <div className="divider-rainbow !h-[3px] !rounded-full !border-0 !bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300" />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Address</h3>
                    <p className="text-sm text-gray-600">{SCHOOL_CONFIG.address}</p>
                  </div>
                </div>
                <div className="divider-rainbow !h-[3px] !rounded-full !border-0 !bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300" />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Hours</h3>
                    <p className="text-sm text-gray-600">
                      Monday — Friday: 9:00 AM — 5:00 PM CST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up [animation-delay:200ms]">
            <Card fun="amber">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">✉️</span>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Send a Message
                  </h2>
                </div>

                {status === 'success' ? (
                  <div className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-emerald-50 p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-500" />
                    <p className="text-lg font-semibold text-emerald-800">
                      Message Sent! 🎉
                    </p>
                    <p className="text-sm text-emerald-600">
                      Thanks for reaching out! We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="_gotcha" className="hidden" />
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input id="name" name="name" type="text" required
                        className="mt-1 block w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input id="email" name="email" type="email" required
                        className="mt-1 block w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                      <input id="subject" name="subject" type="text"
                        className="mt-1 block w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea id="message" name="message" rows={4} required
                        className="mt-1 block w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    {status === 'error' && (
                      <p className="text-center text-sm font-medium text-red-600">
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}
                    <button type="submit" disabled={status === 'submitting'}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-60">
                      {status === 'submitting' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                      ) : '✉️ Send Message'}
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          <span className="animate-float text-lg">💫</span>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
        </div>
      </div>
    </div>
  )
}
