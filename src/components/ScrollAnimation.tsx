'use client'

import { useEffect } from 'react'

export default function ScrollAnimation() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.animate-on-scroll')
    )

    // Reveal elements that are already inside the viewport (handles refresh
    // with restored scroll position, where the observer can miss elements).
    // This is invisible to the user — those sections would be visible anyway —
    // it only prevents them staying blank after a refresh.
    const revealInViewport = () => {
      const viewportBottom = window.innerHeight + 120 // generous margin
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < viewportBottom && rect.bottom > 0) {
          el.classList.add('visible')
        }
      })
    }

    // Fail-safe: whatever the observer or timers miss, everything becomes
    // visible shortly after load. Content must NEVER stay hidden.
    const revealAll = () => {
      elements.forEach((el) => el.classList.add('visible'))
    }

    // If IntersectionObserver is unavailable, just show everything now.
    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    // Run the viewport check now AND repeatedly, so content is shown even if
    // the browser restores scroll position after JS loads, or images/video
    // load late and shift the layout. Then a final fail-safe reveals all.
    revealInViewport()
    const timers = [
      window.setTimeout(revealInViewport, 600),
      window.setTimeout(revealInViewport, 1400),
      window.setTimeout(revealInViewport, 2200),
      window.setTimeout(revealAll, 3000),
    ]

    // pageshow fires on refresh/bfcache restore, when the effect may not re-run.
    const onPageShow = () => revealInViewport()
    window.addEventListener('pageshow', onPageShow)

    return () => {
      observer.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  return null
}
