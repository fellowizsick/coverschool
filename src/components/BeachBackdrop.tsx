/**
 * BeachBackdrop — the admin dashboards' scene. Sky blue, because that is Anne's favourite colour.
 *
 * Jonathan, 2026-09-11: "I want her dashboard to be super simple to use super easy to
 * understand and everything clear look organized if you can make it with a beautiful beach
 * scene that would be awesome only her admin dashboard on the site gets this nobody else's
 * mine gets it too but only admin dashboards" — then: "I want her dashboard still very easy
 * to read even with the scene her favorite color is blue like sky blue"
 *
 * READABILITY IS THE CONSTRAINT, so this file only paints the BACKDROP. The dashboard content
 * sits on a near-opaque white panel above it (see dashboard/layout.tsx). Nothing here is ever
 * behind text. Every layer is fixed and pointer-events:none, so it cannot sit in front of a
 * control or swallow a click.
 *
 * Pure CSS — no image files: nothing to load, nothing to 404, prints quiet.
 *
 * Rendered ONLY from src/app/dashboard/layout.tsx, which is hard-locked to admins before this
 * mounts. That is what makes it admin-dashboard-only rather than a site-wide theme.
 */
export default function BeachBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* sky — sky blue, her colour, deepening gently upward */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#8fcdf0 0%,#addcf7 26%,#cfeafb 46%,#e6f5fd 60%,#f4fafe 72%)' }}
      />
      {/* a few soft clouds, flat and low-contrast so they read as calm rather than busy */}
      <div className="absolute" style={{ left: '10%', top: '12%', width: '230px', height: '54px', borderRadius: '999px', background: 'rgba(255,255,255,.72)', filter: 'blur(7px)' }} />
      <div className="absolute" style={{ left: '22%', top: '17%', width: '140px', height: '40px', borderRadius: '999px', background: 'rgba(255,255,255,.55)', filter: 'blur(6px)' }} />
      <div className="absolute" style={{ right: '12%', top: '8%', width: '290px', height: '60px', borderRadius: '999px', background: 'rgba(255,255,255,.62)', filter: 'blur(8px)' }} />
      {/* sun — soft, high and right, so it never competes with the content column */}
      <div
        className="absolute"
        style={{ right: '16%', top: '6%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle,#fffdf2 0%,#fff2c4 40%,rgba(255,238,180,0) 74%)', filter: 'blur(1px)' }}
      />
      {/* sea — the blue family, calm at the horizon and richer toward the sand */}
      <div
        className="absolute left-0 right-0"
        style={{ top: '58%', bottom: '19%', background: 'linear-gradient(180deg,#bfe6f7 0%,#8fd0ee 26%,#63b8e0 58%,#449fd0 100%)' }}
      />
      {/* whitecaps — two soft bands give movement without noise */}
      <div
        className="absolute left-0 right-0"
        style={{ top: '61%', height: '22px', background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.6) 22%,rgba(255,255,255,0) 46%,rgba(255,255,255,.5) 72%,rgba(255,255,255,0) 100%)', filter: 'blur(2px)' }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ top: '67%', height: '15px', background: 'linear-gradient(90deg,rgba(255,255,255,0) 10%,rgba(255,255,255,.45) 40%,rgba(255,255,255,0) 64%,rgba(255,255,255,.35) 88%,rgba(255,255,255,0) 100%)', filter: 'blur(2.5px)' }}
      />
      {/* wet sand, then dry sand */}
      <div className="absolute left-0 right-0" style={{ top: '81%', bottom: '11%', background: 'linear-gradient(180deg,#d5c8a8,#dfd4b8)' }} />
      <div className="absolute left-0 right-0 bottom-0" style={{ top: '89%', background: 'linear-gradient(180deg,#e9e2cd,#f0ebdc)' }} />
      {/* A light wash, heavily weighted to the top where the heading and nav live. The content
          panel does the real readability work; this just keeps the chrome from fighting it. */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.62),rgba(255,255,255,.42))' }} />
    </div>
  )
}
