import { motion } from 'framer-motion'
import { PlayCircle, StopCircle } from 'lucide-react'
import { SessionTimer } from './SessionTimer'
import { DailyRing } from '../Progress/DailyRing'

type Props = {
  isClockedIn: boolean
  liveSeconds: number
  progressPct: number
  clockInLabel: string
  clockOutLabel: string
  onClockToggle: () => void
}

export function ClockWidget({
  isClockedIn,
  liveSeconds,
  progressPct,
  clockInLabel,
  clockOutLabel,
  onClockToggle,
}: Props) {
  return (
    <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
      <div
        className="p-8 md:p-12 border"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--color-textMuted)' }}>
          Focus Session
        </p>
        <SessionTimer seconds={liveSeconds} />

        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02 }}
          onClick={onClockToggle}
          className="hero-cta w-full md:w-[420px] max-w-full mx-auto text-xl md:text-2xl py-5 px-8 flex items-center justify-center gap-3 font-semibold transition"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-text)',
            clipPath: 'polygon(7% 0, 100% 0, 93% 100%, 0 100%)',
          }}
        >
          {isClockedIn ? <StopCircle size={26} /> : <PlayCircle size={26} />}
          {isClockedIn ? clockOutLabel : clockInLabel}
        </motion.button>
      </div>

      <div className="mx-auto">
        <DailyRing percentage={progressPct} />
      </div>
    </div>
  )
}
