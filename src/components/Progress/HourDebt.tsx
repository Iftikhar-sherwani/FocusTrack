import { formatHoursMinutes } from '../../utils/timeCalc'

type Props = {
  carryOver: number
}

export function HourDebt({ carryOver }: Props) {
  const pct = Math.min(100, (carryOver / 8) * 100)
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: 'var(--color-textMuted)' }}>Carry-Over Debt</span>
        <span>{formatHoursMinutes(carryOver)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-progressTrack)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'var(--color-warning)',
          }}
        />
      </div>
    </div>
  )
}
