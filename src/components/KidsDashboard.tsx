'use client'

import { useState, useEffect } from 'react'
import { Star, Flame, BookOpen, ChevronRight } from 'lucide-react'

interface Subject {
  id: string
  name: string
  emoji: string
  bgColor: string
  hoverColor: string
  progress: number
  totalLessons: number
}

interface KidsLearningDashboardProps {
  childName?: string
  grade?: number
  starsEarned?: number
  dayStreak?: number
  lessonsCompleted?: number
}

export default function KidsLearningDashboard({
  childName = "Emma",
  grade = 1,
  starsEarned = 47,
  dayStreak = 5,
  lessonsCompleted = 23
}: KidsLearningDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const subjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      emoji: '🔢',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      hoverColor: 'hover:from-green-300 hover:to-green-400',
      progress: 75,
      totalLessons: 20
    },
    {
      id: 'language',
      name: 'Language Arts',
      emoji: '📚',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
      hoverColor: 'hover:from-blue-300 hover:to-blue-400',
      progress: 60,
      totalLessons: 18
    },
    {
      id: 'spelling',
      name: 'Spelling & Words',
      emoji: '✏️',
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      hoverColor: 'hover:from-purple-300 hover:to-purple-400',
      progress: 45,
      totalLessons: 15
    },
    {
      id: 'science',
      name: 'Science',
      emoji: '🔬',
      bgColor: 'bg-gradient-to-br from-teal-400 to-teal-500',
      hoverColor: 'hover:from-teal-300 hover:to-teal-400',
      progress: 30,
      totalLessons: 12
    },
    {
      id: 'history',
      name: 'History & Geography',
      emoji: '🌍',
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
      hoverColor: 'hover:from-orange-300 hover:to-orange-400',
      progress: 55,
      totalLessons: 16
    },
    {
      id: 'bible',
      name: 'Bible & Character',
      emoji: '⭐',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      hoverColor: 'hover:from-yellow-300 hover:to-yellow-400',
      progress: 80,
      totalLessons: 14
    }
  ]

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }
    return currentTime.toLocaleDateString('en-US', options)
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return '🌅'
    if (hour < 17) return '☀️'
    return '🌙'
  }

  const handleSubjectClick = (subjectId: string) => {
    console.log(`Starting ${subjectId} lessons!`)
    // Add navigation logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-64 left-1/4 w-5 h-5 bg-blue-300 rounded-full opacity-60 animate-bounce delay-300"></div>
        <div className="absolute bottom-32 right-1/3 w-4 h-4 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-2 tracking-wide">
            Hi, {childName}! {getGreeting()}
          </h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg">
              <span className="text-2xl md:text-3xl font-bold text-purple-600">
                📚 Grade {grade}
              </span>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700">
            📅 {formatDate()}
          </p>
        </header>

        {/* Subject Cards Grid */}
        <main className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                onMouseEnter={() => setHoveredCard(subject.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  ${subject.bgColor} ${subject.hoverColor}
                  relative p-8 rounded-3xl shadow-2xl 
                  transform transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-3xl hover:-translate-y-2
                  active:scale-95 active:transition-none
                  min-h-[200px] w-full
                  focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50
                `}
              >
                {/* Subject Emoji */}
                <div className="text-6xl md:text-7xl mb-4 filter drop-shadow-lg">
                  {subject.emoji}
                </div>
                
                {/* Subject Name */}
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-lg">
                  {subject.name}
                </h2>
                
                {/* Progress Bar */}
                <div className="bg-white bg-opacity-30 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                
                {/* Progress Text */}
                <p className="text-white font-bold text-lg drop-shadow">
                  {Math.round(subject.totalLessons * subject.progress / 100)} of {subject.totalLessons} done!
                </p>
                
                {/* Hover Arrow */}
                {hoveredCard === subject.id && (
                  <div className="absolute top-4 right-4">
                    <ChevronRight className="w-8 h-8 text-white animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </main>

        {/* Stats Bar */}
        <footer className="bg-white rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            
            {/* Stars */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-2">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
              <span className="text-3xl font-black text-gray-800">{starsEarned}</span>
              <span className="text-lg font-bold text-gray-600">⭐ Stars</span>
            </div>
            
            {/* Streak */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
                <Flame className="w-8 h-8 text-red-500 fill-current" />
              </div>
              <span className="text-3xl font-black text-gray-800">{dayStreak}</span>
              <span className="text-lg font-bold text-gray-600">🔥 Day Streak</span>
            </div>
            
            {/* Lessons */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-3xl font-black text-gray-800">{lessonsCompleted}</span>
              <span className="text-lg font-bold text-gray-600">📖 Lessons</span>
            </div>
            
          </div>
        </footer>
      </div>
    </div>
  )
}