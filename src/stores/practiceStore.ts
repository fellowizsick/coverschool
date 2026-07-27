'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Attempt, SkillMastery, PracticeSession, Question } from '@/types/practice'

interface PracticeStore {
  attempts: Attempt[]
  skillMasteries: Record<string, SkillMastery>
  currentSession: PracticeSession | null

  recordAttempt: (attempt: Attempt) => void
  updateSkillMastery: (skillId: string) => void
  startSession: (questions: Question[]) => void
  completeSession: () => void
  calculateMasteryStatus: (skillId: string) => SkillMastery['status']
  getStreak: () => number
  getStars: () => number
  getTodayAttempts: () => number
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      attempts: [],
      skillMasteries: {},
      currentSession: null,

      recordAttempt: (attempt) => {
        set((state) => ({
          attempts: [...state.attempts, attempt]
        }))
        attempt.skillIds.forEach(skillId => {
          get().updateSkillMastery(skillId)
        })
      },

      updateSkillMastery: (skillId) => {
        const { attempts } = get()
        const skillAttempts = attempts.filter(a => a.skillIds.includes(skillId))
        const sessions = new Set(skillAttempts.map(a =>
          a.timestamp instanceof Date
            ? a.timestamp.toDateString()
            : new Date(a.timestamp).toDateString()
        )).size

        const firstTryCorrect = skillAttempts.filter(a => a.attemptNumber === 1 && a.correct).length
        const totalAttempts = skillAttempts.length
        const status = get().calculateMasteryStatus(skillId)

        set((state) => ({
          skillMasteries: {
            ...state.skillMasteries,
            [skillId]: {
              skillId,
              status,
              totalAttempts,
              correctFirstTry,
              sessionsWorkedOn: sessions,
              lastPracticed: new Date(),
              masteredAt: status === 'mastered'
                ? new Date()
                : state.skillMasteries[skillId]?.masteredAt
            }
          }
        }))
      },

      calculateMasteryStatus: (skillId) => {
        const { attempts } = get()
        const skillAttempts = attempts.filter(a => a.skillIds.includes(skillId))
        if (skillAttempts.length === 0) return 'not-started'

        const recentAttempts = skillAttempts.slice(-10)
        const correctFirstTry = recentAttempts.filter(a => a.attemptNumber === 1 && a.correct).length
        const sessions = new Set(skillAttempts.map(a =>
          a.timestamp instanceof Date
            ? a.timestamp.toDateString()
            : new Date(a.timestamp).toDateString()
        )).size

        if (correctFirstTry >= 4 && sessions >= 3 && (correctFirstTry / recentAttempts.length) >= 0.8) {
          return 'mastered'
        }

        const accuracy = skillAttempts.filter(a => a.correct).length / skillAttempts.length
        if (accuracy < 0.4 || skillAttempts.filter(a => a.solutionViewed).length >= 3) {
          return 'needs-help'
        }

        return 'practiced'
      },

      startSession: (questions) => {
        set({
          currentSession: {
            id: Date.now().toString(),
            skillIds: [...new Set(questions.flatMap(q => q.skillIds))],
            questions,
            startedAt: new Date(),
            score: 0,
            totalQuestions: questions.length
          }
        })
      },

      completeSession: () => {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            completedAt: new Date()
          } : null
        }))
      },

      getStreak: () => {
        const { attempts } = get()
        let streak = 0
        let currentDate = new Date()
        while (streak < 30) {
          const dateStr = currentDate.toDateString()
          const hasActivity = attempts.some(a =>
            a.timestamp instanceof Date
              ? a.timestamp.toDateString() === dateStr
              : new Date(a.timestamp).toDateString() === dateStr
          )
          if (!hasActivity) break
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        }
        return streak
      },

      getStars: () => {
        return get().attempts.filter(a => a.correct && a.attemptNumber === 1).length
      },

      getTodayAttempts: () => {
        const today = new Date().toDateString()
        return get().attempts.filter(a =>
          a.timestamp instanceof Date
            ? a.timestamp.toDateString() === today
            : new Date(a.timestamp).toDateString() === today
        ).length
      }
    }),
    {
      name: 'lca-practice-storage',
      // Serialize dates properly
      partialize: (state) => ({
        attempts: state.attempts,
        skillMasteries: Object.fromEntries(
          Object.entries(state.skillMasteries).map(([k, v]) => [
            k,
            {
              ...v,
              lastPracticed: v.lastPracticed?.toISOString(),
              masteredAt: v.masteredAt?.toISOString(),
            }
          ])
        ),
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        attempts: (persisted?.attempts || []).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })),
        skillMasteries: Object.fromEntries(
          Object.entries(persisted?.skillMasteries || {}).map(([k, v]: [string, any]) => [
            k,
            {
              ...v,
              lastPracticed: v.lastPracticed ? new Date(v.lastPracticed) : undefined,
              masteredAt: v.masteredAt ? new Date(v.masteredAt) : undefined,
            }
          ])
        ),
      }),
    }
  )
)
