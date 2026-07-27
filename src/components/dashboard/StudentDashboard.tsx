'use client'

import React from 'react'
import { usePracticeStore } from '@/stores/practiceStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, Trophy, Target, Calendar } from 'lucide-react'

export const StudentDashboard: React.FC = () => {
  const { skillMasteries, attempts, getStreak, getStars, getTodayAttempts } = usePracticeStore()
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const masteredThisWeek = Object.values(skillMasteries).filter(
    s => s.masteredAt && new Date(s.masteredAt) >= thisWeek
  ).length

  const stars = getStars()
  const streak = getStreak()
  const todayQ = getTodayAttempts()

  const skillsByStatus = {
    mastered: Object.values(skillMasteries).filter(s => s.status === 'mastered').length,
    practiced: Object.values(skillMasteries).filter(s => s.status === 'practiced').length,
    needsHelp: Object.values(skillMasteries).filter(s => s.status === 'needs-help').length,
    notStarted: 100 - Object.keys(skillMasteries).length,
  }

  const totalDone = skillsByStatus.mastered + skillsByStatus.practiced + skillsByStatus.needsHelp

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Learning Dashboard</h1>
        <p className="text-gray-600">Keep up the great work! 🌟</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Star className="text-yellow-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-yellow-600">{stars}</div>
          <div className="text-sm text-gray-600">Stars Earned</div>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="text-amber-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-amber-600">{masteredThisWeek}</div>
          <div className="text-sm text-gray-600">Mastered This Week</div>
        </Card>
        <Card className="p-4 text-center">
          <Calendar className="text-blue-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-blue-600">{streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </Card>
        <Card className="p-4 text-center">
          <Target className="text-green-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-green-600">{todayQ}</div>
          <div className="text-sm text-gray-600">Questions Today</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Skills Progress</h2>
        <div className="space-y-4">
          <Bar label="Mastered" count={skillsByStatus.mastered} total={Math.max(totalDone, 100)} color="bg-green-500" />
          <Bar label="Practiced" count={skillsByStatus.practiced} total={Math.max(totalDone, 100)} color="bg-blue-500" />
          <Bar label="Needs Help" count={skillsByStatus.needsHelp} total={Math.max(totalDone, 100)} color="bg-red-500" />
          <Bar label="Not Started" count={skillsByStatus.notStarted} total={Math.max(totalDone, 100)} color="bg-gray-300" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" /> Recently Mastered
        </h2>
        {Object.values(skillMasteries).filter(s => s.status === 'mastered').length === 0 ? (
          <p className="text-gray-500 text-center py-4">Keep practicing to master your first skill! 🎯</p>
        ) : (
          <div className="space-y-2">
            {Object.values(skillMasteries)
              .filter(s => s.status === 'mastered')
              .sort((a, b) => (b.masteredAt?.getTime() || 0) - (a.masteredAt?.getTime() || 0))
              .slice(0, 5)
              .map(s => (
                <div key={s.skillId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-sm">{s.skillId}</span>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Trophy size={14} /> Mastered!
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">What to Practice Next</h2>
        <div className="space-y-3">
          {Object.values(skillMasteries).filter(s => s.status === 'needs-help').slice(0, 3).map(s => (
            <div key={s.skillId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div><span className="font-medium text-sm">{s.skillId}</span><p className="text-xs text-red-600">Needs practice</p></div>
              <Button variant="outline" size="sm">Practice</Button>
            </div>
          ))}
          {Object.values(skillMasteries).filter(s => s.status === 'practiced').slice(0, 2).map(s => (
            <div key={s.skillId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div><span className="font-medium text-sm">{s.skillId}</span><p className="text-xs text-blue-600">Ready to master</p></div>
              <Button variant="primary" size="sm">Practice</Button>
            </div>
          ))}
          {Object.keys(skillMasteries).length === 0 && (
            <p className="text-gray-500 text-center py-4">Complete a lesson to start tracking skills! 📚</p>
          )}
        </div>
      </Card>
    </div>
  )
}

function Bar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}
