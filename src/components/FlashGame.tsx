'use client'

import { useState, useMemo } from 'react'

interface GameQuestion {
  question: string
  answer: string
  options: string[]
  icon: string
}

function generateGame(summary: string, title: string): GameQuestion[] {
  const games: GameQuestion[] = []
  
  if (title.match(/count|number/i) || summary.match(/\d+/)) {
    const nums = [...new Set((summary.match(/\d+/g) || ['1','2','3','4','5']).map(Number).sort((a,b) => a-b))].slice(0, 5)
    nums.forEach(n => {
      const wrong = nums.filter(x => x !== n).slice(0, 3)
      const opts = [...wrong, n].sort(() => Math.random() - 0.5)
      games.push({ question: `Find the number ${n}`, answer: String(n), options: opts.map(String), icon: '🔢' })
    })
    return games.slice(0, 3)
  }
  
  if (title.match(/letter|sound|phonic|alphabet|spell/i)) {
    const letters = [...new Set((summary.match(/[A-Za-z]/g) || ['A','B','C']).map(l => l.toUpperCase()))].slice(0, 5)
    letters.forEach(l => {
      const wrong = letters.filter(x => x !== l).slice(0, 3)
      const opts = [...wrong, l].sort(() => Math.random() - 0.5)
      games.push({ question: `Find the letter ${l}`, answer: l, options: opts, icon: '📖' })
    })
    return games.slice(0, 3)
  }
  
  if (title.match(/shape|circle|square|triangle/i)) {
    const shapes = ['Circle','Square','Triangle','Star','Diamond','Heart']
    shapes.slice(0, 3).forEach(s => {
      const wrong = shapes.filter(x => x !== s).slice(0, 3)
      const opts = [...wrong, s].sort(() => Math.random() - 0.5)
      games.push({ question: `Find the ${s}`, answer: s, options: opts, icon: '🔵' })
    })
    return games
  }
  
  return [{ question: 'Tap to continue!', answer: 'ok', options: ['ok'], icon: '🎉' }]
}

export default function FlashGame({ summary, title, onComplete }: { summary: string; title: string; onComplete: () => void }) {
  const questions = useMemo(() => generateGame(summary, title), [summary, title])
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [done, setDone] = useState(false)
  
  const q = questions[qIndex]
  
  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{score === questions.length ? '🏆' : '🌟'}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {score === questions.length ? 'Perfect Score!' : `${score}/${questions.length} Correct!`}
        </h3>
        <p className="text-slate-500 mb-4">You did great!</p>
        <button onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 font-semibold hover:shadow-lg transition">
          ✅ Continue
        </button>
      </div>
    )
  }
  
  if (!q) {
    onComplete()
    return null
  }
  
  function handleAnswer(opt: string) {
    if (answered) return
    setAnswered(true)
    const isCorrect = opt === q.answer
    setCorrect(isCorrect)
    if (isCorrect) {
      setScore(s => s + 1)
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance('Correct!')
      u.rate = 0.8
      synth.speak(u)
    }
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex(i => i + 1)
        setAnswered(false)
        setCorrect(null)
      } else {
        setDone(true)
      }
    }, 1200)
  }
  
  return (
    <div className="text-center py-6">
      <div className="text-sm text-slate-500 mb-4">Quick Quiz — {qIndex + 1} of {questions.length}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        <span className="mr-2">{q.icon}</span>
        {q.question}
      </h3>
      
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {q.options.map(opt => {
          let cls = 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50'
          if (answered) {
            if (opt === q.answer) cls = 'border-emerald-500 bg-emerald-50 scale-105'
            else cls = 'border-slate-200 bg-slate-50 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className={`rounded-xl border-2 px-6 py-4 text-xl font-bold text-slate-700 transition-all ${cls}`}>
              {opt}
            </button>
          )
        })}
      </div>
      
      {correct === true && <p className="text-emerald-600 font-semibold mt-4">✅ Correct!</p>}
      {correct === false && <p className="text-red-500 mt-4">Not quite — keep trying!</p>}
      <div className="text-xs text-slate-400 mt-4">Score: {'⭐'.repeat(score)}{'☆'.repeat(questions.length - score)}</div>
    </div>
  )
}
