import { Gauge, History, ListTodo, Target } from 'lucide-react'
import type { ReactNode } from 'react'
import { useUIStore } from '../../store/useUIStore'
import type { AppView } from '../../types'

const tabs: Array<{ id: AppView; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Dash', icon: <Gauge size={18} /> },
  { id: 'todo', label: 'Todo', icon: <ListTodo size={18} /> },
  { id: 'history', label: 'History', icon: <History size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Target size={18} /> },
]

export function MobileTabBar() {
  const activeView = useUIStore((state) => state.activeView)
  const setView = useUIStore((state) => state.setView)

  return (
    <nav
      className="fixed md:hidden bottom-0 left-0 right-0 z-40 border-t px-2 py-2 grid grid-cols-4 gap-2"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeView
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className="py-2 text-xs flex flex-col items-center justify-center gap-1 border"
            style={{
              borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
              color: active ? 'var(--color-accent)' : 'var(--color-textMuted)',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
