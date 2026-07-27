'use client'

const STOPS = [
  { name: 'Start', icon: '🏁', color: 'bg-slate-400' },
  { name: 'Unit 1', icon: '📍', color: 'bg-emerald-500' },
  { name: 'Unit 2', icon: '📍', color: 'bg-sky-500' },
  { name: 'Unit 3', icon: '📍', color: 'bg-violet-500' },
  { name: 'Unit 4', icon: '📍', color: 'bg-amber-500' },
  { name: 'Complete', icon: '🏆', color: 'bg-yellow-500' },
]

export default function AdventureMap({ progress, total, onSelectUnit }: {
  progress: number
  total: number
  onSelectUnit: (unit: number) => void
}) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0
  const stops = Math.min(Math.ceil(total / 20) + 1, STOPS.length)
  
  return (
    <div className="bg-white/60 rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-1">🗺️ Your Learning Adventure</h3>
      <p className="text-sm text-slate-500 mb-4">{progress} of {total} steps done ({pct}%)</p>
      
      {/* Path */}
      <div className="relative flex items-center justify-between mb-6">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 h-1.5 bg-slate-200 rounded" />
        <div className="absolute left-0 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded transition-all duration-500"
          style={{ width: `${pct}%` }} />
        
        {/* Stops */}
        {STOPS.slice(0, stops).map((stop, i) => {
          const isPast = pct >= (i / (stops - 1)) * 100
          return (
            <button key={i} onClick={() => onSelectUnit(i)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg
                transition-all duration-300 ${isPast ? stop.color + ' text-white shadow-md' : 'bg-slate-200 text-slate-400'}
                hover:scale-110`}
              title={stop.name}>
              {stop.icon}
            </button>
          )
        })}
      </div>
      
      {/* Label */}
      <div className="flex justify-between text-xs text-slate-400 px-1">
        <span>Start</span>
        <span>Finish</span>
      </div>
    </div>
  )
}
