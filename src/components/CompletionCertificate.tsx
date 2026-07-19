'use client'

import { Button } from '@/components/ui/Button'

// Grade-aware theme: younger = playful/bright/cartoon, older = formal/graduation.
function themeFor(gradeNum: number) {
  if (gradeNum <= 2) {
    return {
      emoji: '🌈',
      accent: 'from-pink-400 via-yellow-300 to-sky-400',
      title: 'text-5xl sm:text-6xl',
      ribbon: '🎨 Super Star Learner 🎨',
      seal: '⭐',
      border: 'border-8 border-dashed border-pink-300',
      blurb: 'You are a shining star! You finished your whole grade and we are SO proud! 🧸',
      font: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
    }
  }
  if (gradeNum <= 5) {
    return {
      emoji: '🚀',
      accent: 'from-violet-400 via-fuchsia-400 to-indigo-400',
      title: 'text-5xl sm:text-7xl',
      ribbon: '🌟 Rising Scholar 🌟',
      seal: '🚀',
      border: 'border-8 border-double border-violet-300',
      blurb: 'Blast off! You completed your grade with curiosity and courage. Keep reaching! 🪐',
      font: "'Trebuchet MS', sans-serif",
    }
  }
  if (gradeNum <= 8) {
    return {
      emoji: '🏅',
      accent: 'from-blue-500 via-cyan-400 to-emerald-400',
      title: 'text-5xl sm:text-7xl',
      ribbon: '🏅 Young Achiever 🏅',
      seal: '🏅',
      border: 'border-8 border-double border-blue-300',
      blurb: 'Steady and strong — you finished your grade with focus and faith. Onward! ⚡',
      font: "'Georgia', serif",
    }
  }
  // high school
  return {
    emoji: '🎓',
    accent: 'from-indigo-600 via-purple-600 to-slate-700',
    title: 'text-5xl sm:text-7xl',
    ribbon: '🎖️ Honors Graduate 🎖️',
    seal: '🎓',
    border: 'border-8 border-double border-indigo-400',
    blurb: 'With discipline and purpose you completed your grade. The diploma is in sight. 🌟',
    font: "'Georgia', serif",
  }
}

export default function CompletionCertificate({
  studentName,
  grade,
  gradeNum,
  date,
}: {
  studentName: string
  grade: string
  gradeNum: number
  date: string
}) {
  const t = themeFor(gradeNum)

  // On-screen animated view (digital = cool effects)
  const onScreen = (
    <div
      className={`mt-6 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden bg-gradient-to-br ${t.accent} text-white cert-pop`}
      style={{ fontFamily: t.font }}
    >
      {/* animated sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {['✨', '⭐', '🌟', '💫', '🎉'].map((e, i) => (
          <span
            key={i}
            className="absolute text-2xl twinkle"
            style={{ left: `${8 + i * 18}%`, top: `${10 + (i % 3) * 25}%`, animationDelay: `${i * 0.4}s` }}
          >
            {e}
          </span>
        ))}
      </div>
      {/* shimmer sweep */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      <div className="relative">
        <div className="text-5xl mb-2 spin-slow">{t.emoji}</div>
        <h3 className="text-2xl font-extrabold">Certificate Ready!</h3>
        <p className="mt-2 opacity-95 text-sm">{t.blurb}</p>
        <Button
          onClick={() => window.print()}
          variant="gold"
          size="lg"
          className="mt-4 bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
        >
          🖨️ Get My Certificate
        </Button>
      </div>

      <style jsx>{`
        .cert-pop { animation: pop 0.6s ease-out; }
        @keyframes pop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .twinkle { animation: tw 1.8s ease-in-out infinite; }
        @keyframes tw { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .spin-slow { animation: spin 6s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .shimmer {
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}</style>
    </div>
  )

  // Print view (clean, landscape, grade-themed)
  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!doctype html><html><head><title>Certificate - ${grade}</title>
<meta charset="utf-8"/>
<style>
  @page { size: landscape; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ${t.font}; }
  .wrap { position: relative; width: 100vw; height: 100vh; overflow: hidden;
    background: radial-gradient(circle at 50% 0%, #fff, #f8fafc); }
  .border { position: absolute; inset: 18px; border: 10px double #4f46e5; border-radius: 22px;
    box-shadow: 0 0 0 6px #fde68a inset; }
  .content { position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 0 8vw; color: #1e293b; }
  .school { font-size: 2.6vh; letter-spacing: 3px; text-transform: uppercase; color: #4f46e5; font-weight: bold; }
  .title { font-size: 8vh; margin: 1.5vh 0 0.5vh; font-weight: 900;
    background: linear-gradient(90deg, #7c3aed, #4f46e5, #0ea5e9);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .ribbon { display: inline-block; margin: 1vh 0; padding: 0.6vh 3vw; border-radius: 999px;
    background: linear-gradient(90deg, #f59e0b, #fbbf24); color: #7c2d12; font-weight: bold; font-size: 2.2vh; }
  .award { font-size: 2.4vh; margin: 1vh 0 0.4vh; }
  .name { font-size: 6.4vh; font-weight: 900; color: #6d28d9; margin: 0.6vh 0;
    border-bottom: 3px solid #c4b5fd; padding: 0 5vw 0.4vh; }
  .body { font-size: 2.5vh; max-width: 64vw; margin: 1.2vh 0; line-height: 1.5; }
  .seal { position: absolute; right: 12%; bottom: 16%; width: 15vh; height: 15vh; border-radius: 50%;
    border: 4px dashed #f59e0b; background: radial-gradient(circle, #fff7ed, #fed7aa);
    display: flex; align-items: center; justify-content: center; font-size: 6vh; }
  .foot { position: absolute; bottom: 7%; width: 70vw; display: flex; justify-content: space-between; font-size: 1.9vh; color: #334155; }
  .sig { border-top: 1.5px solid #475569; padding-top: 0.5vh; min-width: 22vw; }
  .cross { position: absolute; left: 12%; top: 14%; font-size: 4vh; color: #ef444455; }
</style></head><body>
<div class="wrap">
  <div class="border"></div>
  <div class="cross">✝</div>
  <div class="content">
    <div class="school">★ Larose Christian Academy ★</div>
    <div class="title">Certificate of Completion</div>
    <div class="ribbon">${t.ribbon}</div>
    <div class="award">This certifies that</div>
    <div class="name">${studentName}</div>
    <div class="body">${t.blurb}<br/><br/><strong>${grade}</strong></div>
    <div class="seal">${t.seal}</div>
    <div class="foot">
      <div class="sig">Date: ${date}</div>
      <div class="sig">Anne Brown, Administrator</div>
    </div>
  </div>
</div>
<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 400); }</script>
</body></html>`)
    w.document.close()
  }

  // override print to use the print view
  return (
    <div>
      <div onClick={handlePrint} className="cursor-pointer">
        {onScreen}
      </div>
    </div>
  )
}
