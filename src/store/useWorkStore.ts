import { endOfWeek, format, startOfWeek } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DayLog, WorkSession } from '../types'
import {
  calculateSessionMinutes,
  computeOutcome,
  createEmptyDayLog,
  getLatestCarryOver,
  sumSessionHours,
  toDateKey,
} from '../utils/timeCalc'

type WorkStore = {
  activeSessions: WorkSession[]
  dayLogs: DayLog[]
  dailyGoal: number
  weeklyAlertEnabled: boolean
  weeklyDeficitThreshold: number
  workDays: number[]
  clockIn: () => void
  clockOut: (forcedEndTime?: number) => void
  closeDay: () => void
  setDailyGoal: (goal: number) => void
  setWeeklyAlertEnabled: (enabled: boolean) => void
  setWeeklyDeficitThreshold: (threshold: number) => void
  setWorkDays: (days: number[]) => void
  getTodayLog: () => DayLog
  getWeekLogs: () => DayLog[]
  getWeeklyDeficit: () => number
  clearAllData: () => void
}

const upsertLog = (logs: DayLog[], next: DayLog) => {
  const idx = logs.findIndex((log) => log.date === next.date)
  if (idx === -1) {
    return [...logs, next]
  }

  const copy = [...logs]
  copy[idx] = next
  return copy
}

const buildTodayLog = (logs: DayLog[], dailyGoal: number, now = Date.now()): DayLog => {
  const date = toDateKey(now)
  const existing = logs.find((log) => log.date === date)

  if (existing) {
    return existing
  }

  const carryOver = getLatestCarryOver(logs)
  return createEmptyDayLog(date, dailyGoal, carryOver)
}

export const useWorkStore = create<WorkStore>()(
  persist(
    (set, get) => ({
      activeSessions: [],
      dayLogs: [],
      dailyGoal: 6,
      weeklyAlertEnabled: true,
      weeklyDeficitThreshold: 2,
      workDays: [1, 2, 3, 4, 5, 6, 0],

      clockIn: () =>
        set((state) => {
          if (state.activeSessions.some((session) => session.endTime === null)) {
            return state
          }

          const session: WorkSession = {
            id: crypto.randomUUID(),
            startTime: Date.now(),
            endTime: null,
            duration: 0,
          }

          const today = buildTodayLog(state.dayLogs, state.dailyGoal)
          return {
            activeSessions: [session],
            dayLogs: upsertLog(state.dayLogs, today),
          }
        }),

      clockOut: (forcedEndTime?: number) =>
        set((state) => {
          const active = state.activeSessions.find((session) => session.endTime === null)
          if (!active) {
            return state
          }

          const endTime = forcedEndTime || Date.now()
          const duration = Math.max(0, calculateSessionMinutes(active.startTime, endTime))

          const completedSession: WorkSession = {
            ...active,
            endTime,
            duration,
          }

          const today = buildTodayLog(state.dayLogs, state.dailyGoal, endTime)
          const sessions = [...today.sessions, completedSession]
          const totalWorked = sumSessionHours(sessions)
          const outcome = computeOutcome(today.baseGoal, today.carryOver, totalWorked)

          return {
            activeSessions: [],
            dayLogs: upsertLog(state.dayLogs, {
              ...today,
              sessions,
              totalWorked,
              effectiveGoal: outcome.effectiveGoal,
              deficit: outcome.deficit,
              surplus: outcome.surplus,
            }),
          }
        }),

      closeDay: () =>
        set((state) => {
          const today = buildTodayLog(state.dayLogs, state.dailyGoal)
          const totalWorked = sumSessionHours(today.sessions)
          const outcome = computeOutcome(today.baseGoal, today.carryOver, totalWorked)
          const closedLog: DayLog = {
            ...today,
            totalWorked,
            effectiveGoal: outcome.effectiveGoal,
            deficit: outcome.deficit,
            surplus: outcome.surplus,
            closed: true,
          }

          return {
            activeSessions: [],
            dayLogs: upsertLog(state.dayLogs, closedLog),
          }
        }),

      setDailyGoal: (goal) =>
        set((state) => {
          const safeGoal = Math.max(1, Number(goal) || 1)
          const date = toDateKey()
          const updatedLogs = state.dayLogs.map((log) => {
            if (log.date !== date || log.closed) {
              return log
            }

            const outcome = computeOutcome(safeGoal, log.carryOver, log.totalWorked)
            return {
              ...log,
              baseGoal: safeGoal,
              effectiveGoal: outcome.effectiveGoal,
              deficit: outcome.deficit,
              surplus: outcome.surplus,
            }
          })

          return {
            dailyGoal: safeGoal,
            dayLogs: updatedLogs,
          }
        }),

      setWeeklyAlertEnabled: (enabled) => set({ weeklyAlertEnabled: enabled }),
      setWeeklyDeficitThreshold: (threshold) =>
        set({ weeklyDeficitThreshold: Math.max(0.5, threshold) }),
      setWorkDays: (days) => set({ workDays: days }),

      getTodayLog: () => {
        const state = get()
        const log = buildTodayLog(state.dayLogs, state.dailyGoal)
        const active = state.activeSessions.find((session) => session.endTime === null)

        if (!active) {
          return log
        }

        const liveMinutes = calculateSessionMinutes(active.startTime, Date.now())
        const liveSession: WorkSession = {
          ...active,
          duration: liveMinutes,
        }

        const sessions = [...log.sessions, liveSession]
        const totalWorked = sumSessionHours(sessions)
        const outcome = computeOutcome(log.baseGoal, log.carryOver, totalWorked)

        return {
          ...log,
          sessions,
          totalWorked,
          effectiveGoal: outcome.effectiveGoal,
          deficit: outcome.deficit,
          surplus: outcome.surplus,
        }
      },

      getWeekLogs: () => {
        const state = get()
        const now = new Date()
        const weekStart = startOfWeek(now, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

        const map = new Map(state.dayLogs.map((log) => [log.date, log]))
        const result: DayLog[] = []
        for (let i = 0; i < 7; i += 1) {
          const date = new Date(weekStart)
          date.setDate(weekStart.getDate() + i)
          if (date > weekEnd) {
            break
          }

          const key = format(date, 'yyyy-MM-dd')
          const existing = map.get(key)

          if (existing) {
            result.push(existing)
          } else {
            result.push(createEmptyDayLog(key, state.dailyGoal, 0))
          }
        }

        return result
      },

      getWeeklyDeficit: () => {
        const state = get()
        const logs = state.getWeekLogs()
        const worked = logs.reduce((sum, log) => sum + log.totalWorked, 0)
        const todayIndex = Math.max(0, new Date().getDay() - 1)
        const daysElapsed = Math.min(7, todayIndex + 1)
        const expected = state.dailyGoal * daysElapsed

        return Math.max(0, expected - worked)
      },

      clearAllData: () =>
        set({
          activeSessions: [],
          dayLogs: [],
          dailyGoal: 6,
          weeklyAlertEnabled: true,
          weeklyDeficitThreshold: 2,
          workDays: [1, 2, 3, 4, 5, 6, 0],
        }),
    }),
    {
      name: 'focus-work-store',
    },
  ),
)
