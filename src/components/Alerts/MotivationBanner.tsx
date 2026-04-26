import { Flame } from 'lucide-react'

export function MotivationBanner() {
  return (
    <div className="theme-card border p-3 flex items-center gap-2">
      <Flame size={18} color="var(--color-warning)" />
      <p className="text-sm">Discipline beats mood. Log one focused session now.</p>
    </div>
  )
}
