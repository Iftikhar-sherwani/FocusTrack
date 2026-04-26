import type { Theme } from '../types'

export const minimalTheme: Theme = {
  id: 'minimal',
  name: 'Minimal',
  font: {
    heading: 'Playfair Display',
    body: 'Lato',
  },
  colors: {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F5F3',
    border: '#E5E5E0',
    accent: '#1A1A1A',
    accentHover: '#333333',
    text: '#1A1A1A',
    textMuted: '#888880',
    progress: '#1A1A1A',
    progressTrack: '#E5E5E0',
    success: '#2D6A2D',
    warning: '#B8860B',
    danger: '#8B1A1A',
  },
  progressRingGradient: ['#1A1A1A', '#555555'],
  clockInLabel: 'Begin Session',
  clockOutLabel: 'End Session',
  backgroundStyle:
    'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px) 0 0 / 14px 14px, #FAFAF9',
  cardStyle: 'border-radius: 8px; border: 1px solid #E5E5E0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);',
}
