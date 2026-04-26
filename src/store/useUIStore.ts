import { create } from 'zustand'
import type { AppView } from '../types'

type UIStore = {
  activeView: AppView
  sidebarCollapsed: boolean
  todoPanelCollapsed: boolean
  setView: (view: AppView) => void
  toggleSidebar: () => void
  toggleTodoPanel: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: 'dashboard',
  sidebarCollapsed: false,
  todoPanelCollapsed: false,
  setView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleTodoPanel: () =>
    set((state) => ({
      todoPanelCollapsed: !state.todoPanelCollapsed,
    })),
}))
