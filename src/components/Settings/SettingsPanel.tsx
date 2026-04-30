import toast from 'react-hot-toast'
import { GoalSettings } from './GoalSettings'
import { ThemePicker } from './ThemePicker'
import { useAuthStore } from '../../store/useAuthStore'
import { useWorkStore } from '../../store/useWorkStore'
import { useTodoStore } from '../../store/useTodoStore'

export function SettingsPanel() {
  const weeklyAlertEnabled = useWorkStore((state) => state.weeklyAlertEnabled)
  const setWeeklyAlertEnabled = useWorkStore((state) => state.setWeeklyAlertEnabled)
  const weeklyDeficitThreshold = useWorkStore((state) => state.weeklyDeficitThreshold)
  const setWeeklyDeficitThreshold = useWorkStore((state) => state.setWeeklyDeficitThreshold)
  const clearWorkData = useWorkStore((state) => state.clearAllData)
  const clearTodoData = useTodoStore((state) => state.clearAllData)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="space-y-4">
      {/* Account */}
      <div className="theme-card border p-4 space-y-3">
        <h3 className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Account
        </h3>
        <div className="text-sm space-y-1">
          <p>
            <span style={{ color: 'var(--color-textMuted)' }}>Name: </span>
            <strong>{user?.name}</strong>
          </p>
          <p>
            <span style={{ color: 'var(--color-textMuted)' }}>Email: </span>
            <strong>{user?.email}</strong>
          </p>
        </div>
        <button
          onClick={() => {
            logout()
            localStorage.removeItem('hasSignedUp')
            toast.success('Signed out')
            setTimeout(() => window.location.reload(), 500)
          }}
          className="px-4 py-2 border text-sm font-medium"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-danger)' }}
        >
          Sign Out
        </button>
      </div>

      <GoalSettings />

      <div className="theme-card border p-4 space-y-3">
        <h3 className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Alerts
        </h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={weeklyAlertEnabled}
            onChange={(event) => setWeeklyAlertEnabled(event.target.checked)}
          />
          Weekly deficit alert enabled
        </label>

        <label className="block text-sm">Deficit threshold (hours)</label>
        <input
          type="number"
          step={0.5}
          min={0.5}
          value={weeklyDeficitThreshold}
          onChange={(event) => setWeeklyDeficitThreshold(Number(event.target.value) || 0.5)}
          className="px-3 py-2 border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        />
      </div>

      <ThemePicker />

      <div className="theme-card border p-4 space-y-3">
        <h3 className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Data
        </h3>

        <button
          onClick={() => {
            const work = useWorkStore.getState()
            const todos = useTodoStore.getState()
            const payload = {
              work: {
                dayLogs: work.dayLogs,
                dailyGoal: work.dailyGoal,
                workDays: work.workDays,
                weeklyAlertEnabled: work.weeklyAlertEnabled,
                weeklyDeficitThreshold: work.weeklyDeficitThreshold,
              },
              todos: todos.todos,
            }

            const blob = new Blob([JSON.stringify(payload, null, 2)], {
              type: 'application/json',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `focustrack-export-${new Date().toISOString().slice(0, 10)}.json`
            a.click()
            URL.revokeObjectURL(url)
            toast.success('Data exported')
          }}
          className="px-4 py-2 border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Export Data as JSON
        </button>

        <button
          onClick={() => {
            if (window.confirm('Clear all FocusTrack data? This cannot be undone.')) {
              clearWorkData()
              clearTodoData()
              toast.success('All data cleared')
            }
          }}
          className="px-4 py-2"
          style={{ background: 'var(--color-danger)', color: '#fff' }}
        >
          Clear All Data
        </button>
      </div>
    </div>
  )
}
