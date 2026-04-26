import type { Theme } from '../types'

export const militaryTheme: Theme = {
  id: 'military',
  name: 'Military',
  font: {
    heading: 'Rajdhani',
    body: 'Source Code Pro',
  },
  colors: {
    bg: '#0C1A0C',
    surface: '#142414',
    surfaceAlt: '#1C301C',
    border: '#2C4A2C',
    accent: '#7CB518',
    accentHover: '#A0D320',
    text: '#D4E6D4',
    textMuted: '#6A8A6A',
    progress: '#7CB518',
    progressTrack: '#1C301C',
    success: '#7CB518',
    warning: '#D4A017',
    danger: '#CC3300',
  },
  progressRingGradient: ['#7CB518', '#A0D320'],
  clockInLabel: 'DEPLOY',
  clockOutLabel: 'STAND DOWN',
  backgroundStyle:
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 12px), repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 12px), #0C1A0C',
  cardStyle: 'border-left: 4px solid var(--color-accent); border-radius: 0; box-shadow: 0 10px 22px rgba(0,0,0,0.3);',
}
