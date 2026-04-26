import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { DayLog } from '../../types'

type Props = {
  data: DayLog[]
}

export function WeeklyBar({ data }: Props) {
  const chartData = data.map((day) => ({
    day: day.date.slice(5),
    hours: Number(day.totalWorked.toFixed(2)),
  }))

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="day" stroke="var(--color-textMuted)" fontSize={11} />
          <YAxis stroke="var(--color-textMuted)" fontSize={11} />
          <Bar dataKey="hours" fill="var(--color-progress)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
