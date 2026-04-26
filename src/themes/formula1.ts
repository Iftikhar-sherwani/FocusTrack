import type { Theme } from '../types'

export const formula1Theme: Theme = {
  id: 'formula1',
  name: 'Formula 1',
  font: {
    heading: 'Russo One',
    body: 'DM Sans',
  },
  colors: {
    bg: '#0A0A0A',
    surface: '#111111',
    surfaceAlt: '#1A1A1A',
    border: '#2A2A2A',
    accent: '#E8002D',
    accentHover: '#FF1744',
    text: '#FFFFFF',
    textMuted: '#888888',
    progress: '#E8002D',
    progressTrack: '#1A1A1A',
    success: '#00D2BE',
    warning: '#FFF200',
    danger: '#E8002D',
  },
  progressRingGradient: ['#E8002D', '#FF6A00'],
  clockInLabel: 'START ENGINE',
  clockOutLabel: 'PIT STOP',
  backgroundStyle:
    'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0 8px, transparent 8px 16px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.01) 0 8px, transparent 8px 16px), #0A0A0A',
  cardStyle: 'border-left: 3px solid var(--color-accent); border-radius: 0px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);',
}
