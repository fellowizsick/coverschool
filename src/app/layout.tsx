import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollAnimation from '@/components/ScrollAnimation'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Larose Christian Academy | Supporting Homeschool Families',
  description:
    'An Alabama-based church school providing cover school services for homeschooling families across the United States. Homeschool with confidence.',
  openGraph: {
    title: 'Larose Christian Academy',
    description:
      'Supporting homeschool families across America with legal oversight, record-keeping, and community.',
    siteName: 'Larose Christian Academy',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Larose Christian Academy crest' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Progressive enhancement gate: only hide scroll-animated content when
            JS is actually running. Prevents the blank-page flash on slow first
            loads (cold cache / slow bundle) where content stays opacity:0. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen overflow-x-clip bg-white font-sans text-gray-900">
        {/* Decorative floating elements that follow the page */}
        <div className="fixed top-40 left-0 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl animate-float pointer-events-none -z-10" />
        <div className="fixed bottom-40 right-0 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl animate-float-delayed pointer-events-none -z-10" />
        <div className="fixed top-1/2 right-1/4 h-40 w-40 rounded-full bg-pink-200/15 blur-3xl animate-pulse-soft pointer-events-none -z-10" />

        <ScrollAnimation />
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <Script
          data-goatcounter="https://larosechristianacademy.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
