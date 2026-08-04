import { MetadataRoute } from 'next'
import { STATE_LAWS } from '@/lib/stateLaw'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://laroseca.org'

  const routes = [
    '',
    '/about',
    '/states',
    '/how-it-works',
    '/faq',
    '/contact',
    '/enroll',
    '/referral',
    '/privacy',
    '/terms',
    '/calendar',
    '/homeschool-law',
  ]

  const stateRoutes = STATE_LAWS.map((s) => `/homeschool-law/${s.code.toLowerCase()}`)

  return [...routes, ...stateRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/homeschool-law') ? 0.7 : 0.8,
  }))
}
