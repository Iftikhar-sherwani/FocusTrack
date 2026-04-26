import type { Theme } from '../types'

export const dashboardTheme: Theme = {
  id: 'dashboard',
  name: 'Light',
  font: {
    heading: 'DM Sans',
    body: 'DM Sans',
  },
  colors: {
    bg: '#E8E2D0',
    surface: '#FFFFFF',
    surfaceAlt: '#F2EEE2',
    border: '#DDD8C8',
    accent: '#EAB308',
    accentHover: '#CA9A06',
    text: '#1A1A1A',
    textMuted: '#888880',
    progress: '#EAB308',
    progressTrack: '#E8E8DE',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
  progressRingGradient: ['#EAB308', '#F59E0B'],
  clockInLabel: 'Start Session',
  clockOutLabel: 'End Session',
  backgroundStyle: '#E8E2D0',
  cardStyle: 'border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);',
}
