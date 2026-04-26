import type { Theme } from '../types'

export const footballTheme: Theme = {
  id: 'football',
  name: 'Football',
  font: {
    heading: 'Bebas Neue',
    body: 'Nunito',
  },
  colors: {
    bg: '#0D1B2A',
    surface: '#142332',
    surfaceAlt: '#1C2F40',
    border: '#1E3A4F',
    accent: '#4CAF50',
    accentHover: '#66BB6A',
    text: '#F0F4F8',
    textMuted: '#7A8FA0',
    progress: '#4CAF50',
    progressTrack: '#1C2F40',
    success: '#4CAF50',
    warning: '#FFC107',
    danger: '#F44336',
  },
  progressRingGradient: ['#4CAF50', '#9CCC65'],
  clockInLabel: 'KICK OFF',
  clockOutLabel: 'HALF TIME',
  backgroundStyle:
    'repeating-linear-gradient(120deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 14px), #0D1B2A',
  cardStyle: 'border-radius: 12px; box-shadow: 0 8px 24px rgba(76,175,80,0.2);',
}
