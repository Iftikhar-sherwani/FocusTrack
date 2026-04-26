export type WorkSession = {
  id: string
  startTime: number
  endTime: number | null
  duration: number
}

export type DayLog = {
  date: string
  baseGoal: number
  carryOver: number
  effectiveGoal: number
  totalWorked: number
  deficit: number
  surplus: number
  sessions: WorkSession[]
  closed: boolean
}

export type TodoStatus = 'pending' | 'in-progress' | 'done'

export type Todo = {
  id: string
  title: string
  type: 'daily' | 'weekly'
  priority: 'high' | 'medium' | 'low'
  status: TodoStatus
  estimatedMinutes?: number
  dueDate?: string
  createdAt: number
  order: number
}

export type Theme = {
  id: string
  name: string
  font: { heading: string; body: string }
  colors: {
    bg: string
    surface: string
    surfaceAlt: string
    border: string
    accent: string
    accentHover: string
    text: string
    textMuted: string
    progress: string
    progressTrack: string
    success: string
    warning: string
    danger: string
  }
  progressRingGradient: [string, string]
  clockInLabel: string
  clockOutLabel: string
  backgroundStyle: string
  cardStyle: string
}

export type AppView = 'dashboard' | 'todo' | 'history' | 'settings'
