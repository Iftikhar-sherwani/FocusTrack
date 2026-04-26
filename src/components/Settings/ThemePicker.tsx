import { Check } from 'lucide-react'
import { themes } from '../../themes'
import { useThemeStore } from '../../store/useThemeStore'

export function ThemePicker() {
  const activeTheme = useThemeStore((state) => state.activeTheme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="theme-card border p-4">
      <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        Theme
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {themes.map((theme) => {
          const active = theme.id === activeTheme.id
          return (
            <button
              key={theme.id}
              className="border p-3 text-left"
              style={{
                borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
                background: 'var(--color-surfaceAlt)',
              }}
              onClick={() => setTheme(theme.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{theme.name}</p>
                {active ? <Check size={16} /> : null}
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[theme.colors.bg, theme.colors.surface, theme.colors.accent, theme.colors.progress, theme.colors.danger].map(
                  (color) => (
                    <span key={color} className="h-5 rounded" style={{ background: color }} />
                  ),
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
