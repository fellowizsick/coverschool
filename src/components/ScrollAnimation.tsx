'use client'

import { useEffect } from 'react'

export default function ScrollAnimation() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.animate-on-scroll')
    )

    // Safety net: if anything is still hidden shortly after load, show it.
    // Prevents "blank sections" when JS is slow, cached, or the observer misses.
    const revealAll = () => {
      elements.forEach((el) => el.classList.add('visible'))
    }
    const failSafe = window.setTimeout(revealAll, 2000)

    // If IntersectionObserver is unavailable, just show everything now.
    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return () => window.clearTimeout(failSafe)
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

    // Immediately reveal anything already in the viewport (handles refresh
    // with restored scroll position, where the observer can miss elements).
    const viewportBottom = window.innerHeight
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < viewportBottom && rect.bottom > 0) {
        el.classList.add('visible')
      }
    })

    return () => {
      observer.disconnect()
      window.clearTimeout(failSafe)
    }
  }, [])

  return null
}
