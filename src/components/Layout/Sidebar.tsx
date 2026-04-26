import { Bell, Gauge, History, ListTodo, Palette, Target } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { themes } from '../../themes'
import { useThemeStore } from '../../store/useThemeStore'
import { useUIStore } from '../../store/useUIStore'
import type { AppView } from '../../types'

const navItems: Array<{ id: AppView; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={15} /> },
  { id: 'todo', label: 'Todo', icon: <ListTodo size={15} /> },
  { id: 'history', label: 'History', icon: <History size={15} /> },
  { id: 'settings', label: 'Settings', icon: <Target size={15} /> },
]

export function Sidebar() {
  const theme = useThemeStore((state) => state.activeTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const activeView = useUIStore((state) => state.activeView)
  const setView = useUIStore((state) => state.setView)
  const [showThemes, setShowThemes] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowThemes(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center h-16 px-6 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <Target size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
            FocusTrack
          </span>
        </div>

        {/* Nav tabs */}
        <div
          className="hidden md:flex items-center gap-1 rounded-full p-1"
          style={{ background: 'var(--color-surfaceAlt)' }}
        >
          {navItems.map((item) => {
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--color-text)' : 'transparent',
                  color: active ? 'var(--color-surface)' : 'var(--color-textMuted)',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme picker */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setShowThemes((v) => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-surfaceAlt)' }}
              aria-label="Switch theme"
            >
              <Palette size={16} style={{ color: 'var(--color-textMuted)' }} />
            </button>
            {showThemes && (
              <div
                className="absolute right-0 top-11 rounded-2xl border shadow-xl p-3 flex flex-wrap gap-2"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  minWidth: 180,
                }}
              >
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setShowThemes(false) }}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      background: t.colors.accent,
                      borderColor: theme.id === t.id ? 'var(--color-text)' : 'transparent',
                    }}
                    title={t.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bell */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surfaceAlt)' }}
            aria-label="Notifications"
          >
            <Bell size={16} style={{ color: 'var(--color-textMuted)' }} />
          </button>
        </div>
      </div>
    </header>
  )
}
