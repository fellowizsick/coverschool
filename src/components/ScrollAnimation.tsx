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
      const viewportBottom = window.innerHeight
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < viewportBottom && rect.bottom > 0) {
          el.classList.add('visible')
        }
      })
    }

    // If IntersectionObserver is unavailable, just show everything now.
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('visible'))
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

    // Run the viewport check now AND again after a beat, so content is shown
    // even if the browser restores scroll position slightly after JS loads.
    revealInViewport()
    const retry = window.setTimeout(revealInViewport, 600)

    return () => {
      observer.disconnect()
      window.clearTimeout(retry)
    }
  }, [])

  return null
}
