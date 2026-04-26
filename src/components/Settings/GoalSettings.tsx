import { Minus, Plus } from 'lucide-react'
import { useWorkStore } from '../../store/useWorkStore'

const weekDays = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' },
]

export function GoalSettings() {
  const dailyGoal = useWorkStore((state) => state.dailyGoal)
  const setDailyGoal = useWorkStore((state) => state.setDailyGoal)
  const closeDay = useWorkStore((state) => state.closeDay)
  const workDays = useWorkStore((state) => state.workDays)
  const setWorkDays = useWorkStore((state) => state.setWorkDays)

  const toggleWorkDay = (day: number) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day))
    } else {
      setWorkDays([...workDays, day])
    }
  }

  return (
    <div className="theme-card border p-4 space-y-4">
      <h3 className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
        Work Goals
      </h3>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDailyGoal(Math.max(1, dailyGoal - 0.5))}
          className="p-2 border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          min={1}
          step={0.5}
          value={dailyGoal}
          onChange={(event) => setDailyGoal(Number(event.target.value) || 1)}
          className="px-3 py-2 border w-24 text-center"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        />
        <button
          onClick={() => setDailyGoal(dailyGoal + 0.5)}
          className="p-2 border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div>
        <p className="text-sm mb-2" style={{ color: 'var(--color-textMuted)' }}>
          Work days
        </p>
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => {
            const active = workDays.includes(day.id)
            return (
              <button
                key={day.id}
                onClick={() => toggleWorkDay(day.id)}
                className="px-3 py-1 border text-sm"
                style={{
                  borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
                  background: active ? 'var(--color-surfaceAlt)' : 'transparent',
                }}
              >
                {day.label}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={closeDay}
        className="px-4 py-2 font-semibold"
        style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}
      >
        Close Today and Apply Carry-over
      </button>
    </div>
  )
}
