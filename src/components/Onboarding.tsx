import { useState } from 'react'
import { themes } from '../themes'
import { useThemeStore } from '../store/useThemeStore'
import { useWorkStore } from '../store/useWorkStore'

type Props = {
  onDone: () => void
}

export function Onboarding({ onDone }: Props) {
  const [goal, setGoal] = useState(6)
  const setDailyGoal = useWorkStore((state) => state.setDailyGoal)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--app-bg)' }}>
      <div
        className="w-full max-w-xl p-8 border"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome to FocusTrack
        </h1>
        <p style={{ color: 'var(--color-textMuted)' }} className="mb-6">
          Set your base work goal and pick a visual identity before your first session.
        </p>

        <label className="block text-sm mb-2">Daily Goal (hours)</label>
        <input
          type="number"
          min={1}
          max={16}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value) || 1)}
          className="w-full mb-6 px-3 py-2 border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        />

        <div className="grid grid-cols-5 gap-2 mb-6">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="h-10 rounded border"
              style={{ background: theme.colors.accent, borderColor: 'var(--color-border)' }}
              aria-label={theme.name}
              title={theme.name}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setDailyGoal(goal)
            onDone()
          }}
          className="w-full py-3 text-lg font-semibold"
          style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}
        >
          Let's Go
        </button>
      </div>
    </div>
  )
}
