import type { Theme } from '../types'

export const boxingTheme: Theme = {
  id: 'boxing',
  name: 'Boxing',
  font: {
    heading: 'Barlow Condensed',
    body: 'Barlow',
  },
  colors: {
    bg: '#1A0A00',
    surface: '#241008',
    surfaceAlt: '#301510',
    border: '#4A2010',
    accent: '#FF6B00',
    accentHover: '#FF8C00',
    text: '#F5ECD5',
    textMuted: '#A08060',
    progress: '#FF6B00',
    progressTrack: '#301510',
    success: '#B8860B',
    warning: '#FFD700',
    danger: '#DC143C',
  },
  progressRingGradient: ['#FF6B00', '#FFD700'],
  clockInLabel: 'ENTER THE RING',
  clockOutLabel: 'CORNER BREAK',
  backgroundStyle:
    'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px) 0 0 / 10px 10px, #1A0A00',
  cardStyle: 'border: 1px solid #4A2010; border-radius: 4px; box-shadow: 6px 6px 0 rgba(0,0,0,0.35);',
}
