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
  const [dueDate, setDueDate] = useState('')

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
      dueDate: dueDate || undefined,
    })

    setTitle('')
    setEstimatedMinutes('')
    setDueDate('')
  }

  return (
    <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto]">
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
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="px-2 py-2 border"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
      />
      <button
        onClick={submit}
        className="px-4 py-2 font-semibold"
        style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}
      >
        Add
      </button>
    </div>
  )
}
