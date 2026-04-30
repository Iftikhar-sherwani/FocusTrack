import { AnimatePresence, motion } from 'framer-motion'
import { endOfDay, format, isBefore, parseISO } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { CalendarDays, Flame, Play, Shield, Square } from 'lucide-react'
import { DeficitAlert } from './components/Alerts/DeficitAlert'
import { HistoryView } from './components/History/HistoryView'
import { Header } from './components/Layout/Header'
import { MobileTabBar } from './components/Layout/MobileTabBar'
import { Sidebar } from './components/Layout/Sidebar'
import { ThemeWrapper } from './components/Layout/ThemeWrapper'
import { Onboarding } from './components/Onboarding'
import { DailyRing } from './components/Progress/DailyRing'
import { HourDebt } from './components/Progress/HourDebt'
import { WeeklyBar } from './components/Progress/WeeklyBar'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { TodoPanel } from './components/TodoList/TodoPanel'
import { TodoView } from './components/TodoList/TodoView'
import { useThemeStore } from './store/useThemeStore'
import { useTodoStore } from './store/useTodoStore'
import { useUIStore } from './store/useUIStore'
import { useWorkStore } from './store/useWorkStore'
import { getAlertMessage, shouldTriggerWeeklyAlert } from './utils/alertEngine'
import { formatHoursMinutes } from './utils/timeCalc'
import { SignupModal } from './components/Auth/SignupModal'

function DashboardView() {
  const clockIn = useWorkStore((state) => state.clockIn)
  const clockOut = useWorkStore((state) => state.clockOut)
  const getTodayLog = useWorkStore((state) => state.getTodayLog)
  const getWeekLogs = useWorkStore((state) => state.getWeekLogs)
  const getWeeklyDeficit = useWorkStore((state) => state.getWeeklyDeficit)
  const weeklyAlertEnabled = useWorkStore((state) => state.weeklyAlertEnabled)
  const weeklyDeficitThreshold = useWorkStore((state) => state.weeklyDeficitThreshold)
  const activeSessions = useWorkStore((state) => state.activeSessions)
  const todos = useTodoStore((state) => state.todos)

  const [now, setNow] = useState(Date.now())
  const [dismissedAt, setDismissedAt] = useState<number | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todayLog = getTodayLog()
  const weekLogs = getWeekLogs()
  const weeklyDeficit = getWeeklyDeficit()
  const goalPct = (todayLog.totalWorked / Math.max(0.001, todayLog.effectiveGoal)) * 100
  const isClockedIn = activeSessions.length > 0
  const currentSession = activeSessions[0]
  const liveSeconds = currentSession
    ? Math.max(0, Math.floor((now - currentSession.startTime) / 1000))
    : 0

  const alertMessage = useMemo(() => getAlertMessage(weeklyDeficit), [weeklyDeficit])
  const allowAlert =
    weeklyAlertEnabled &&
    shouldTriggerWeeklyAlert(weeklyDeficit, weeklyDeficitThreshold) &&
    (!dismissedAt || now - dismissedAt > 2 * 60 * 60 * 1000)

  useEffect(() => {
    const activeDate = todayLog.date
    if (isBefore(endOfDay(parseISO(activeDate)), new Date()) && !todayLog.closed) {
      useWorkStore.getState().closeDay()
    }
  }, [todayLog.date, todayLog.closed])

  // Derived stats
  const dailyTodos = todos.filter((t) => t.type === 'daily')
  const completedTodos = dailyTodos.filter((t) => t.status === 'done').length
  const totalTodos = dailyTodos.length
  const todoPct = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
  const weeklyWorked = weekLogs.reduce((sum, log) => sum + log.totalWorked, 0)
  const activeDays = weekLogs.filter((log) => log.totalWorked > 0).length

  // Live timer display
  const liveHH = String(Math.floor(liveSeconds / 3600)).padStart(2, '0')
  const liveMM = String(Math.floor((liveSeconds % 3600) / 60)).padStart(2, '0')
  const liveSS = String(liveSeconds % 60).padStart(2, '0')

  const statPills = [
    { label: 'Sessions', value: String(todayLog.sessions.length) },
    { label: 'Worked', value: formatHoursMinutes(todayLog.totalWorked), highlight: true },
    { label: 'Goal', value: formatHoursMinutes(todayLog.effectiveGoal) },
    { label: 'Deficit', value: `+${formatHoursMinutes(todayLog.carryOver)}` },
  ]

  return (
    <>
      <DeficitAlert
        show={allowAlert}
        hoursBehind={weeklyDeficit}
        message={alertMessage}
        onDismiss={() => setDismissedAt(Date.now())}
      />

      {/* Welcome header */}
      <div className="mb-7">
        <p className="text-sm mb-1 flex items-center gap-1.5" style={{ color: 'var(--color-textMuted)' }}>
          <CalendarDays size={13} />
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </p>
        <h1 className="text-3xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome back, Champion
        </h1>

        {/* Stats bar */}
        <div
          className="rounded-2xl border p-4 flex flex-wrap items-center gap-4"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="flex flex-wrap gap-2">
            {statPills.map((pill) => (
              <span
                key={pill.label}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: pill.highlight ? 'var(--color-accent)' : 'var(--color-surfaceAlt)',
                  color: pill.highlight ? '#fff' : 'var(--color-text)',
                }}
              >
                {pill.label}: <strong>{pill.value}</strong>
              </span>
            ))}
          </div>
          <div className="ml-auto flex gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">{weeklyWorked.toFixed(1)}</p>
              <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>hrs / week</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{weekLogs.length}</p>
              <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Days Logged</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{activeDays}</p>
              <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Active Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">

        {/* Card 1: Today's Focus */}
        <motion.div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--color-surface)', minHeight: 300, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0 }}
        >
          <div className="p-5 flex-1">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-semibold"
              style={{ color: 'var(--color-textMuted)' }}
            >
              Today's Focus
            </p>
            <p className="text-4xl font-bold mb-1">{formatHoursMinutes(todayLog.totalWorked)}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-textMuted)' }}>hours worked today</p>
            <div
              className="h-2 rounded-full overflow-hidden mb-1.5"
              style={{ background: 'var(--color-progressTrack)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, goalPct)}%`, background: 'var(--color-accent)' }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>
              {Math.round(goalPct)}% of daily goal
            </p>
          </div>
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{ background: 'var(--color-text)' }}
          >
            <div>
              <p className="text-xs opacity-60 mb-0.5" style={{ color: 'var(--color-surface)' }}>Status</p>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-surface)' }}>
                {isClockedIn ? '🔴 In Session' : '⚫ Clocked Out'}
              </p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--color-accent)', color: '#000' }}
            >
              {Math.round(goalPct)}%
            </span>
          </div>
        </motion.div>

        {/* Card 2: Weekly Progress */}
        <motion.div
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
        >
          <div className="mb-3">
            <p
              className="text-xs uppercase tracking-widest mb-1 font-semibold"
              style={{ color: 'var(--color-textMuted)' }}
            >
              Progress
            </p>
            <p className="text-3xl font-bold">{weeklyWorked.toFixed(1)}h</p>
            <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Work time this week</p>
          </div>
          <WeeklyBar data={weekLogs} />
        </motion.div>

        {/* Card 3: Time Tracker */}
        <motion.div
          className="rounded-2xl p-5 flex flex-col"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3 font-semibold"
            style={{ color: 'var(--color-textMuted)' }}
          >
            Time Tracker
          </p>
          <div className="flex justify-center mb-2">
            <DailyRing percentage={goalPct} compact />
          </div>
          <div className="text-center mb-4">
            <p className="font-mono text-2xl font-bold tracking-widest">
              {liveHH}:{liveMM}:{liveSS}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-textMuted)' }}>
              {isClockedIn ? 'Session Running' : 'Work Time'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-auto">
            <motion.button
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.06 }}
              onClick={() => {
                if (isClockedIn) {
                  clockOut()
                  toast.success('Session saved.')
                } else {
                  clockIn()
                  toast.success('Session started. Stay locked in.')
                }
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors"
              style={{
                background: isClockedIn ? '#ef4444' : 'var(--color-accent)',
                color: '#fff',
              }}
              aria-label={isClockedIn ? 'Stop session' : 'Start session'}
            >
              {isClockedIn
                ? <Square size={18} fill="white" />
                : <Play size={18} fill="white" />
              }
            </motion.button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-surfaceAlt)' }}
            >
              <Shield size={15} style={{ color: 'var(--color-textMuted)' }} />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Tasks */}
        <motion.div
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.24 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-1 font-semibold"
                style={{ color: 'var(--color-textMuted)' }}
              >
                Tasks
              </p>
              <p className="text-3xl font-bold">{todoPct}%</p>
              <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>completion rate</p>
            </div>
            <span
              className="px-2 py-1 text-xs rounded-full font-bold mt-1"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              {completedTodos}/{totalTodos}
            </span>
          </div>
          <div className="flex gap-2 text-xs mb-4">
            <span
              className="px-3 py-1 rounded-full font-medium"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              Done {completedTodos}
            </span>
            <span
              className="px-3 py-1 rounded-full font-medium"
              style={{ background: 'var(--color-surfaceAlt)', color: 'var(--color-text)' }}
            >
              Left {totalTodos - completedTodos}
            </span>
          </div>
          <TodoPanel compact />
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Sessions list */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Today's Sessions
          </h3>
          {todayLog.sessions.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>
              No sessions yet. Press Start Session to begin.
            </p>
          ) : (
            <div className="space-y-2">
              {todayLog.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
                  style={{ background: 'var(--color-surfaceAlt)' }}
                >
                  <span>
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' – '}
                    {new Date(session.endTime ?? session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-semibold">{formatHoursMinutes(session.duration / 60)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5">
            <HourDebt carryOver={todayLog.carryOver} />
          </div>
        </div>

        {/* Weekly snapshot + motivation */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Weekly Snapshot
          </h3>
          <WeeklyBar data={weekLogs} />
          <div
            className="mt-4 p-3 rounded-xl flex items-center gap-3"
            style={{ background: 'var(--color-surfaceAlt)' }}
          >
            <Flame size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <p className="text-sm">Discipline beats mood. Log one focused session now.</p>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  const activeView = useUIStore((state) => state.activeView)
  const todos = useTodoStore((state) => state.todos)
  const dayLogs = useWorkStore((state) => state.dayLogs)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [showSignup, setShowSignup] = useState(() => !localStorage.getItem('hasSignedUp'))

  const handleSignupClose = () => {
    localStorage.setItem('hasSignedUp', 'true')
    setShowSignup(false)
  }

  // Check recurring todos periodically
  useEffect(() => {
    const checkTodos = () => {
      useTodoStore.getState().checkRecurringTodos()
    }
    checkTodos() // check immediately
    const id = setInterval(checkTodos, 60_000)
    return () => clearInterval(id)
  }, [])

  const shouldShowOnboarding = !onboardingDone && dayLogs.length === 0 && todos.length === 0

  if (shouldShowOnboarding) {
    return (
      <ThemeWrapper>
        <SignupModal isOpen={showSignup} onClose={handleSignupClose} />
        <Onboarding onDone={() => setOnboardingDone(true)} />
      </ThemeWrapper>
    )
  }

  return (
    <ThemeWrapper>
      <Toaster position="top-right" />
      <SignupModal isOpen={showSignup} onClose={handleSignupClose} />
      
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--app-bg)' }}>
        <Sidebar />
        <main className="flex-1 p-4 pb-24 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'todo' && <TodoView />}
              {activeView === 'history' && <HistoryView />}
              {activeView === 'settings' && (
                <div className="space-y-6">
                  <Header title="Settings" subtitle="Tune goals, alerts, themes, and data behavior." />
                  <SettingsPanel />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <MobileTabBar />
      </div>
    </ThemeWrapper>
  )
}

export default App
