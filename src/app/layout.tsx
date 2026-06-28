import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollAnimation from '@/components/ScrollAnimation'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
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
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-gray-900">
        <ScrollAnimation />
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
