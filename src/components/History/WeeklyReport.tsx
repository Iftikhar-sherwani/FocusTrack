import { useMemo } from 'react'
import { Trophy, Star, Target, AlertTriangle } from 'lucide-react'
import { useWorkStore } from '../../store/useWorkStore'
import { formatHoursMinutes } from '../../utils/timeCalc'
import { useTodoStore } from '../../store/useTodoStore'

export function WeeklyReport() {
  const getWeekLogs = useWorkStore((state) => state.getWeekLogs)
  const dailyGoal = useWorkStore((state) => state.dailyGoal)
  const todos = useTodoStore((state) => state.todos)

  const logs = getWeekLogs()
  const weeklyWorked = logs.reduce((sum, log) => sum + log.totalWorked, 0)
  
  const todayIndex = Math.max(0, new Date().getDay() - 1)
  const daysElapsed = Math.min(7, todayIndex + 1)
  const expectedWorked = dailyGoal * daysElapsed
  const totalWeeklyGoal = dailyGoal * 7

  const performanceRatio = expectedWorked > 0 ? weeklyWorked / expectedWorked : 0

  const badge = useMemo(() => {
    if (performanceRatio >= 1.2) {
      return {
        title: 'Overachiever',
        icon: <Trophy className="w-8 h-8 text-yellow-500" />,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        message: 'Incredible work! You are significantly ahead of your schedule.',
      }
    }
    if (performanceRatio >= 1.0) {
      return {
        title: 'On Track',
        icon: <Star className="w-8 h-8 text-green-500" />,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        message: 'Great job! You are meeting your goals perfectly.',
      }
    }
    if (performanceRatio >= 0.75) {
      return {
        title: 'Almost There',
        icon: <Target className="w-8 h-8 text-blue-500" />,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        message: 'Doing good, but you need a little push to reach your target.',
      }
    }
    return {
      title: 'Needs Improvement',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      message: "Don't give up! Let's focus and get back on track.",
    }
  }, [performanceRatio])

  // Count tasks completed this week (rough estimate for now)
  const completedTasks = todos.filter(t => t.status === 'done').length
  const totalTasks = todos.length

  return (
    <div className={`theme-card border p-6 flex flex-col md:flex-row items-center gap-6 ${badge.bg} ${badge.border}`}>
      <div className={`p-4 rounded-full bg-white/5 shadow-inner ${badge.color}`}>
        {badge.icon}
      </div>
      
      <div className="flex-1 space-y-2 text-center md:text-left">
        <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
          Weekly Performance: <span className={badge.color}>{badge.title}</span>
        </h3>
        <p className="text-sm opacity-80">
          {badge.message}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">Hours Logged</p>
            <p className="text-lg font-medium">
              {formatHoursMinutes(weeklyWorked)} <span className="text-sm opacity-60">/ {formatHoursMinutes(totalWeeklyGoal)}</span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">Tasks Status</p>
            <p className="text-lg font-medium">
              {completedTasks} <span className="text-sm opacity-60">/ {totalTasks} done</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
