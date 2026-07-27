'use client'

import { useState, useEffect, useCallback } from 'react'

interface FlashItem {
  text: string
  color: string
  icon: string
}

function parseFlashCards(summary: string, title: string): FlashItem[] {
  const items: FlashItem[] = []
  const colors = [
    'from-pink-400 to-rose-500', 'from-sky-400 to-blue-500', 'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-fuchsia-400 to-pink-500',
    'from-lime-400 to-green-500', 'from-cyan-400 to-indigo-500',
  ]
  
  items.push({ text: title, color: colors[0], icon: '🌟' })
  
  if (summary.match(/\d+/) || title.match(/count|number|numeral/i)) {
    const nums = [...new Set((summary.match(/\d+/g) || ['1','2','3','4','5','6','7','8','9','10'])
      .map(Number).sort((a,b) => a-b))].slice(0, 10).map(String)
    nums.forEach((n, i) => items.push({ text: n, color: colors[(i + 1) % colors.length], icon: '🔢' }))
    items.push({ text: 'Great counting!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  if (title.match(/letter|sound|phonic|alphabet|spell/i)) {
    const letters = [...new Set((summary.match(/[A-Za-z]/g) || ['A','B','C']).map(l => l.toUpperCase()))].slice(0, 8)
    letters.forEach((l, i) => items.push({ text: l, color: colors[(i + 1) % colors.length], icon: '📖' }))
    items.push({ text: 'Awesome!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  if (title.match(/shape|circle|square|triangle|rectangle/i)) {
    const shapes = [...new Set((summary.match(/\b\w+\b/g) || []).filter(w => 
      /circle|square|triangle|rectangle|round|diamond|star|heart|oval/i.test(w))
      .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()))].slice(0, 6)
    ;(shapes.length ? shapes : ['Circle','Square','Triangle']).forEach((s, i) => 
      items.push({ text: s, color: colors[(i + 1) % colors.length], icon: '🔵' }))
    items.push({ text: 'Amazing!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
    return items
  }
  
  const phrases = summary.split(/[.!?]/).filter(p => p.trim().length > 8).slice(0, 5)
  phrases.forEach((p, i) => items.push({ text: p.trim(), color: colors[(i + 1) % colors.length], icon: '💡' }))
  items.push({ text: 'Wonderful!', color: 'from-yellow-400 to-amber-500', icon: '🎉' })
  return items
}

export default function FlashLesson({ summary, title, onDone }: { summary: string; title: string; onDone: () => void }) {
  const [cards] = useState(() => parseFlashCards(summary, title))
  const [index, setIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [pulse, setPulse] = useState(false)
  
  const current = cards[index]
  
  useEffect(() => {
    if (!autoPlay || !current) return
    setPulse(true)
    const pt = setTimeout(() => setPulse(false), 500)
    
    const synth = window.speechSynthesis
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(current.text)
    utter.rate = 0.7
    utter.pitch = 1.2
    utter.onend = () => {
      if (index >= cards.length - 1) { setAutoPlay(false); return }
      setTimeout(() => setIndex(i => i + 1), 1000)
    }
    synth.speak(utter)
    
    return () => { clearTimeout(pt); synth.cancel() }
  }, [index, autoPlay])
  
  const next = useCallback(() => {
    if (index < cards.length - 1) setIndex(i => i + 1)
    else onDone()
  }, [index, cards.length, onDone])
  
  const prev = useCallback(() => { if (index > 0) setIndex(i => i - 1) }, [index])
  
  if (!current) return null
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        onClick={next}
        className={`
          w-64 h-64 md:w-80 md:h-80 rounded-3xl flex flex-col items-center justify-center
          bg-gradient-to-br ${current.color} text-white shadow-2xl cursor-pointer
          transition-all duration-300 select-none
          ${pulse ? 'scale-110 shadow-amber-400/50' : 'scale-100'}
          hover:scale-105 active:scale-95
        `}
      >
        <span className="text-5xl mb-3">{current.icon}</span>
        <span className="text-4xl md:text-6xl font-bold text-center px-4 leading-tight drop-shadow-lg">
          {current.text}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="flex gap-1.5 mt-6">
        {cards.map((_, i) => (
          <button key={i} onClick={() => { setAutoPlay(false); setIndex(i) }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? 'bg-emerald-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
      
      <div className="flex gap-3 mt-4">
        {index > 0 && <button onClick={prev} className="text-sm text-slate-500 px-3 py-1">←</button>}
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
      <p className="text-xs text-slate-400 mt-2">Tap the card to go forward</p>
    </div>
  )
}
