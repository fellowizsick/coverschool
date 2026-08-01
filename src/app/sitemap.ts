import { MetadataRoute } from 'next'

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
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
