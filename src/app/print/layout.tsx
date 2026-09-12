/**
 * Layout for every printable document under /print — diploma, transcript, report card,
 * enrollment form, record release.
 *
 * WHY THIS EXISTS (found 2026-09-11 by looking at a render, not by reading code)
 * The root layout wraps every route in the site's Navbar and Footer. Nothing sat between the
 * root and /print, so a diploma rendered with the website nav — "Home About How It Works FAQ
 * Curriculum ... Enroll Now" — across the top and the site footer beneath it. On a credential
 * that is the single clearest sign it was not prepared by a school office, and it would print.
 * It also inherited the site's dark background instead of paper white.
 *
 * This layout does not try to un-render the root layout's markup (it cannot). It marks the
 * subtree and lets the rules in globals.css hide the site chrome and force a white page.
 */

export const metadata = {
  title: 'Larose Christian Academy — Document',
  robots: { index: false, follow: false },
}

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="lca-print-root">{children}</div>
}
