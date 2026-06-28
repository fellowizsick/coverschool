'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Contact Us
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Have questions? We&apos;d love to hear from you.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">{SCHOOL_CONFIG.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                  <p className="text-sm text-gray-600">{SCHOOL_CONFIG.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Address</h3>
                  <p className="text-sm text-gray-600">{SCHOOL_CONFIG.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-emerald-600" />
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
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Send a Message
            </h2>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget as HTMLFormElement
                const data = new FormData(form)
                window.location.href = `mailto:${SCHOOL_CONFIG.email}?subject=${encodeURIComponent(
                  `[${SCHOOL_CONFIG.name}] ${(data.get('subject') as string) || 'Inquiry'}`
                )}&body=${encodeURIComponent(
                  `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
                )}`
              }}
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Send via Email
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
