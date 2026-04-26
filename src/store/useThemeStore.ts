import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultTheme, getThemeById } from '../themes'
import type { Theme } from '../types'

type ThemeState = {
  activeTheme: Theme
  setTheme: (id: string) => void
  applyThemeToDOM: (theme: Theme) => void
}

const FONT_WEIGHT_MAP: Record<string, string> = {
  'Russo One': '400',
  'DM Sans': '400;500;700',
  'Bebas Neue': '400',
  Nunito: '400;600;700',
  'Barlow Condensed': '500;700',
  Barlow: '400;500;700',
  Rajdhani: '500;600;700',
  'Source Code Pro': '400;500;600',
  'Playfair Display': '500;700',
  Lato: '400;700',
}

const loadFont = (fontName: string) => {
  const id = `font-${fontName.toLowerCase().replace(/\s+/g, '-')}`
  if (document.getElementById(id)) {
    return
  }

  const family = fontName.replace(/\s+/g, '+')
  const weights = FONT_WEIGHT_MAP[fontName] ?? '400;600;700'
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`
  document.head.appendChild(link)
}

const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement
  root.dataset.theme = theme.id

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  root.style.setProperty('--font-heading', `'${theme.font.heading}', sans-serif`)
  root.style.setProperty('--font-body', `'${theme.font.body}', sans-serif`)
  root.style.setProperty('--ring-start', theme.progressRingGradient[0])
  root.style.setProperty('--ring-end', theme.progressRingGradient[1])
  root.style.setProperty('--app-bg', theme.backgroundStyle)

  loadFont(theme.font.heading)
  loadFont(theme.font.body)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeTheme: defaultTheme,
      setTheme: (id) =>
        set(() => {
          const next = getThemeById(id)
          applyThemeToDOM(next)
          return { activeTheme: next }
        }),
      applyThemeToDOM,
    }),
    {
      name: 'focus-theme-store',
      onRehydrateStorage: () => (state) => {
        if (state?.activeTheme) {
          applyThemeToDOM(state.activeTheme)
        }
      },
    },
  ),
)
