import { CheckCircle2, XCircle } from 'lucide-react'
import type { DayLog } from '../../types'
import { formatHoursMinutes } from '../../utils/timeCalc'

type Props = {
  log: DayLog
}

export function DayCard({ log }: Props) {
  const met = log.totalWorked >= log.effectiveGoal
  const pct = Math.min(100, (log.totalWorked / Math.max(log.effectiveGoal, 0.001)) * 100)

  return (
    <article className="theme-card border p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{log.date}</h4>
        {met ? <CheckCircle2 size={18} color="var(--color-success)" /> : <XCircle size={18} color="var(--color-danger)" />}
      </div>
      <p className="text-sm mb-2" style={{ color: 'var(--color-textMuted)' }}>
        {formatHoursMinutes(log.totalWorked)} / {formatHoursMinutes(log.effectiveGoal)}
      </p>
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--color-progressTrack)' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-progress)' }} />
      </div>
      <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>
        Carry-over: {formatHoursMinutes(log.carryOver)}
      </p>
    </article>
  )
}
