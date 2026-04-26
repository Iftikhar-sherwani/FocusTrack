import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

type Props = {
  percentage: number
  compact?: boolean
}

export function DailyRing({ percentage, compact = false }: Props) {
  const value = Math.min(100, Math.max(0, percentage))
  const ringFill =
    percentage <= 0
      ? 'var(--color-progressTrack)'
      : percentage < 100
        ? 'var(--color-warning)'
        : percentage <= 120
          ? 'var(--color-success)'
          : '#D4AF37'

  return (
    <motion.div
      className={compact ? 'w-28 h-28 relative' : 'w-56 h-56 md:w-72 md:h-72 relative'}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ name: 'done', value }, { name: 'rest', value: 100 - value }]}
            innerRadius="74%"
            outerRadius="94%"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive
            animationDuration={650}
          >
            <Cell fill={ringFill} />
            <Cell fill="var(--color-progressTrack)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          {!compact && (
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--color-textMuted)' }}>
              Goal Progress
            </p>
          )}
          <p className={compact ? 'text-lg font-bold' : 'text-3xl font-bold'}>{Math.round(value)}%</p>
        </div>
      </div>
    </motion.div>
  )
}
