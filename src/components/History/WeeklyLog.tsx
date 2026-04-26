import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useWorkStore } from '../../store/useWorkStore'
import { formatHoursMinutes } from '../../utils/timeCalc'
import { DayCard } from './DayCard'

export function WeeklyLog() {
  const getWeekLogs = useWorkStore((state) => state.getWeekLogs)
  const dailyGoal = useWorkStore((state) => state.dailyGoal)

  const logs = getWeekLogs()
  const weeklyWorked = logs.reduce((sum, log) => sum + log.totalWorked, 0)
  const weeklyGoal = dailyGoal * 7

  const streak = useMemo(() => {
    let count = 0
    for (let i = logs.length - 1; i >= 0; i -= 1) {
      const day = logs[i]
      if (day.totalWorked >= day.effectiveGoal && day.effectiveGoal > 0) {
        count += 1
      } else {
        break
      }
    }
    return count
  }, [logs])

  const chartData = logs.map((log) => ({
    day: log.date.slice(5),
    worked: Number(log.totalWorked.toFixed(2)),
    goal: Number(log.effectiveGoal.toFixed(2)),
  }))

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="theme-card border p-4">
          <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>Weekly Total</p>
          <p className="text-2xl font-semibold">{formatHoursMinutes(weeklyWorked)}</p>
        </div>
        <div className="theme-card border p-4">
          <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>Weekly Goal</p>
          <p className="text-2xl font-semibold">{formatHoursMinutes(weeklyGoal)}</p>
        </div>
        <div className="theme-card border p-4">
          <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>Current Streak</p>
          <p className="text-2xl font-semibold">{streak} days</p>
        </div>
      </div>

      <div className="theme-card border p-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" stroke="var(--color-textMuted)" />
            <YAxis stroke="var(--color-textMuted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            />
            <Bar dataKey="goal" fill="var(--color-progressTrack)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="worked" fill="var(--color-progress)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {logs.map((log) => (
          <DayCard key={log.date} log={log} />
        ))}
      </div>
    </div>
  )
}
