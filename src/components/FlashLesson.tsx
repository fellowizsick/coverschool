'use client'

import { useState, useEffect, useCallback } from 'react'

interface FlashItem {
  text: string
  subtext?: string
  color: string
  icon: string
  dots?: number
}

function parseFlashCards(summary: string, title: string): FlashItem[] {
  const items: FlashItem[] = []
  const colors = [
    'from-pink-400 to-rose-500', 'from-sky-400 to-blue-500', 'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-fuchsia-400 to-pink-500',
    'from-lime-400 to-green-500', 'from-cyan-400 to-indigo-500',
  ]
  
  items.push({ text: title, color: colors[0], icon: '🌟' })
  
  const isCounting = title.match(/count|number|numeral|more|less/i) || /\d+/.test(summary)
  const isLetters = title.match(/letter|sound|phonic|alphabet|spell/i)
  const isShapes = title.match(/shape|circle|square|triangle|rectangle/i)
  
  // COUNTING: Show numbers based on the lesson's actual range
  if (isCounting) {
    let maxNum = 10 // default
    let minNum = 1  // default
    // Try to extract range from title: "Counting 1 to 3", "Numbers 1-5", "Numbers 4 and 5", "Counting to 10"
    const rangeMatch = title.match(/(\d+)\s*(?:to|and|-|through)\s*(\d+)/i)
    const singleMaxMatch = !rangeMatch && title.match(/to\s+(\d+)/i)
    if (rangeMatch) {
      minNum = parseInt(rangeMatch[1])
      maxNum = parseInt(rangeMatch[2])
    } else if (singleMaxMatch) {
      maxNum = parseInt(singleMaxMatch[1])
      // Also try to find a min from the summary
      const sumMatch = summary.match(/(\d+)\s*(?:to|and|-)\s*(\d+)/i)
      if (sumMatch) minNum = parseInt(sumMatch[1])
    }
    // Also check if unit name has a smaller range (e.g. "Q1 - Numbers 1-5")
    if (maxNum > 10) maxNum = 10 // safety cap
    if (minNum < 1) minNum = 1
    for (let i = minNum; i <= maxNum; i++) {
      items.push({
        text: String(i),
         subtext: '•'.repeat(Math.min(i, 20)),
         color: colors[(i - 1) % colors.length],
         icon: '',
         dots: i,
      })
    }
    const congrats = maxNum === 10 ? 'You can count to 10!' : `You can count to ${maxNum}!`
    items.push({ text: congrats, color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  // LETTERS: Show A, B, C, etc.
  if (isLetters) {
    const letters = [...new Set((summary.match(/[A-Za-z]/g) || ['A','B','C','D','E']).map(l => l.toUpperCase()))].slice(0, 8)
    letters.forEach((l, i) => items.push({ text: l, color: colors[(i + 1) % colors.length], icon: '📖' }))
    items.push({ text: 'Amazing!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  // SHAPES
  if (isShapes) {
    const shapes = ['Circle','Square','Triangle','Star','Heart','Diamond']
    shapes.slice(0, 6).forEach((s, i) => items.push({ text: s, color: colors[(i + 1) % colors.length], icon: '🔵' }))
    items.push({ text: 'You know your shapes!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  // DEFAULT: short phrases from summary
  const phrases = summary.split(/[.!?]/).filter(p => p.trim().length > 8).slice(0, 5)
  phrases.forEach((p, i) => items.push({ text: p.trim(), color: colors[(i + 1) % colors.length], icon: '💡' }))
  items.push({ text: 'Wonderful!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
  return items
}

// Sparkle positions for particle effect
const SPARKLES = [
  { top: '10%', left: '10%', delay: '0s' },
  { top: '15%', right: '15%', delay: '0.3s' },
  { bottom: '20%', left: '20%', delay: '0.6s' },
  { bottom: '10%', right: '10%', delay: '0.9s' },
]

export default function FlashLesson({ summary, title, onDone }: { summary: string; title: string; onDone: () => void }) {
  const [cards] = useState(() => parseFlashCards(summary, title))
  const [index, setIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  
  const current = cards[index]
  
  useEffect(() => {
    if (!autoPlay || !current) return
    setPulse(true)
    setShowSparkles(true)
    setTimeout(() => { setPulse(false); setShowSparkles(false) }, 600)
    
    const synth = window.speechSynthesis
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(current.text + (current.subtext ? '' : ''))
    utter.rate = 0.6
    utter.pitch = 1.2
    utter.onend = () => {
      if (index >= cards.length - 1) { setAutoPlay(false); return }
      setTimeout(() => setIndex(i => i + 1), 1200)
    }
    synth.speak(utter)
    
    return () => { synth.cancel() }
  }, [index, autoPlay])
  
  const next = useCallback(() => {
    if (index < cards.length - 1) setIndex(i => i + 1)
    else onDone()
  }, [index, cards.length, onDone])
  
  const prev = useCallback(() => { if (index > 0) setIndex(i => i - 1) }, [index])
  
  if (!current) return null
  
  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      {/* Sparkle particles */}
      {showSparkles && SPARKLES.map((s, i) => (
        <div key={i} className="fixed w-4 h-4 pointer-events-none z-50"
          style={{ ...s, animation: 'sparkle 0.6s ease-out forwards' }}>
          ⭐
        </div>
      ))}
      
      {/* Flash Card */}
      <div
        onClick={next}
        className={`
          w-72 h-72 md:w-80 md:h-80 rounded-3xl flex flex-col items-center justify-center
          bg-gradient-to-br ${current.color} text-white shadow-2xl cursor-pointer
          transition-all duration-300 select-none relative overflow-hidden
          ${pulse ? 'scale-110 shadow-amber-400/50' : 'scale-100'}
          hover:scale-105 active:scale-95
        `}
      >
        {/* Background sparkle decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-6xl absolute top-2 left-2">✨</div>
          <div className="text-4xl absolute bottom-4 right-4">⭐</div>
          <div className="text-5xl absolute top-8 right-8">💫</div>
        </div>
        
        {/* Icon */}
        {current.icon && (
          <span className="text-4xl mb-2 relative z-10">{current.icon}</span>
        )}
        
        {/* Main text - BIG */}
        <span className="text-6xl md:text-7xl font-bold text-center px-4 leading-tight drop-shadow-lg relative z-10">
          {current.text}
        </span>
        
        {/* Subtext (dots for counting) */}
        {current.subtext && (
          <span className="text-lg md:text-xl mt-3 opacity-80 relative z-10 tracking-wider">
            {current.subtext}
          </span>
        )}
        
        {/* Dot quantity visualization */}
        {current.dots && current.dots <= 10 && (
          <div className="flex gap-1 mt-3 relative z-10">
            {Array.from({ length: current.dots }).map((_, i) => (
              <span key={i} className="text-lg animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                ⭐
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="flex gap-1.5 mt-4">
        {cards.slice(0, 12).map((_, i) => (
          <button key={i} onClick={() => { setAutoPlay(false); setIndex(i) }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? 'bg-emerald-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
        {cards.length > 12 && <span className="text-xs text-slate-400 ml-1">+{cards.length - 12}</span>}
      </div>
      
      {/* Controls */}
      <div className="flex gap-3 mt-3">
        {index > 0 && (
          <button onClick={prev} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            ← Back
          </button>
        )}
        <button onClick={() => setAutoPlay(!autoPlay)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            autoPlay ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
          {autoPlay ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={next}
          className="text-xs px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 font-medium hover:bg-sky-200">
          {index < cards.length - 1 ? 'Next →' : '✅ Done'}
        </button>
      </div>
      
      {/* CSS for sparkle animation */}
      <style>{`
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
