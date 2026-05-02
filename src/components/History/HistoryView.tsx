import { Header } from '../Layout/Header'
import { WeeklyLog } from './WeeklyLog'
import { WeeklyReport } from './WeeklyReport'

export function HistoryView() {
  return (
    <div className="space-y-6">
      <Header title="History" subtitle="Review consistency, debt, and performance trends." />
      <WeeklyReport />
      <WeeklyLog />
    </div>
  )
}
