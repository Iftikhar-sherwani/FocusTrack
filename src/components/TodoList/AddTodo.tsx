import { useState } from 'react'
import { useTodoStore } from '../../store/useTodoStore'

type Tab = 'daily' | 'weekly'

type Props = {
  tab: Tab
}

export function AddTodo({ tab }: Props) {
  const addTodo = useTodoStore((state) => state.addTodo)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | ''>('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const submit = () => {
    const clean = title.trim()
    if (!clean) {
      return
    }

    addTodo({
      title: clean,
      type: tab,
      priority,
      status: 'pending',
      estimatedMinutes: estimatedMinutes === '' ? undefined : Number(estimatedMinutes),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : undefined,
    })

    setTitle('')
    setEstimatedMinutes('')
    setStartTime('')
    setEndTime('')
    setDaysOfWeek([])
  }

  return (
    <div className="flex flex-col gap-3 mb-2">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tab === 'daily' ? 'Add a task for today' : 'Add a task for this week'}
          className="px-3 py-2 border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="px-2 py-2 border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="number"
          min={5}
          step={5}
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : '')}
          placeholder="Est. min"
          className="px-2 py-2 border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
        />
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-between border p-2" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="flex gap-1 flex-wrap">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setDaysOfWeek(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])}
              className="px-2 py-1 text-xs border cursor-pointer font-medium"
              style={{
                borderColor: 'var(--color-border)',
                background: daysOfWeek.includes(i) ? 'var(--color-accent)' : 'var(--color-surfaceAlt)',
                color: daysOfWeek.includes(i) ? 'var(--color-text)' : 'inherit'
              }}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-2 py-1 text-sm border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="px-2 py-1 text-sm border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
          />
          <button
            onClick={submit}
            className="px-4 py-1 font-semibold ml-2"
            style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}
