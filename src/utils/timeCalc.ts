import { format } from 'date-fns'
import type { DayLog, WorkSession } from '../types'

export const MINUTES_PER_HOUR = 60

export const toDateKey = (timestamp: number = Date.now()) =>
  format(new Date(timestamp), 'yyyy-MM-dd')

export const minutesToHours = (minutes: number) => minutes / MINUTES_PER_HOUR

export const calculateSessionMinutes = (startTime: number, endTime: number) =>
  Math.max(0, Math.round((endTime - startTime) / 60000))

export const formatHoursMinutes = (hours: number) => {
  const safe = Math.max(0, hours)
  const totalMinutes = Math.round(safe * MINUTES_PER_HOUR)
  const hh = Math.floor(totalMinutes / MINUTES_PER_HOUR)
  const mm = totalMinutes % MINUTES_PER_HOUR
  return `${hh}h ${mm}m`
}

export const createEmptyDayLog = (
  date: string,
  baseGoal: number,
  carryOver: number,
): DayLog => ({
  date,
  baseGoal,
  carryOver,
  effectiveGoal: baseGoal + carryOver,
  totalWorked: 0,
  deficit: baseGoal + carryOver,
  surplus: 0,
  sessions: [],
  closed: false,
})

export const sumSessionHours = (sessions: WorkSession[]) =>
  sessions.reduce((total, session) => total + minutesToHours(session.duration), 0)

export const computeOutcome = (baseGoal: number, carryOver: number, totalWorked: number) => {
  const effectiveGoal = baseGoal + carryOver
  const deficit = Math.max(0, effectiveGoal - totalWorked)
  const surplus = Math.max(0, totalWorked - effectiveGoal)
  const nextCarryOver = Math.max(0, carryOver + baseGoal - totalWorked)

  return {
    effectiveGoal,
    deficit,
    surplus,
    nextCarryOver,
  }
}

export const getLatestCarryOver = (logs: DayLog[]) => {
  if (!logs.length) {
    return 0
  }

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1]
  return Math.max(0, latest.carryOver + latest.baseGoal - latest.totalWorked)
}
