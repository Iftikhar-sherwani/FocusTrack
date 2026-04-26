import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useUIStore } from '../../store/useUIStore'
import { useTodoStore } from '../../store/useTodoStore'
import type { TodoStatus } from '../../types'
import { AddTodo } from './AddTodo'
import { TodoItem } from './TodoItem'

type Props = {
  compact?: boolean
}

export function TodoPanel({ compact = false }: Props) {
  const todos = useTodoStore((state) => state.todos)
  const reorderTodos = useTodoStore((state) => state.reorderTodos)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)
  const todoPanelCollapsed = useUIStore((state) => state.todoPanelCollapsed)
  const toggleTodoPanel = useUIStore((state) => state.toggleTodoPanel)

  const [tab, setTab] = useState<'daily' | 'weekly'>('daily')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | TodoStatus>('all')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const todayItems = useMemo(
    () => [...todos].filter((todo) => todo.type === tab),
    [todos, tab],
  )

  const filtered = useMemo(() => {
    return [...todayItems]
      .filter((todo) => (priorityFilter === 'all' ? true : todo.priority === priorityFilter))
      .filter((todo) => (statusFilter === 'all' ? true : todo.status === statusFilter))
      .sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') {
          return 1
        }
        if (a.status !== 'done' && b.status === 'done') {
          return -1
        }
        return a.order - b.order
      })
  }, [todayItems, priorityFilter, statusFilter])

  const completionPct = useMemo(() => {
    if (!todayItems.length) {
      return 0
    }
    const done = todayItems.filter((todo) => todo.status === 'done').length
    return (done / todayItems.length) * 100
  }, [todayItems])

  const visibleTodos = compact ? filtered.slice(0, 5) : filtered

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = filtered.findIndex((todo) => todo.id === active.id)
    const newIndex = filtered.findIndex((todo) => todo.id === over.id)
    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const moved = arrayMove(filtered, oldIndex, newIndex)
    const untouched = todos.filter((todo) => todo.type !== tab)
    reorderTodos([...untouched, ...moved])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex border" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setTab('daily')}
            className="px-3 py-1 text-sm"
            style={{ background: tab === 'daily' ? 'var(--color-surfaceAlt)' : 'transparent' }}
          >
            Today
          </button>
          <button
            onClick={() => setTab('weekly')}
            className="px-3 py-1 text-sm"
            style={{ background: tab === 'weekly' ? 'var(--color-surfaceAlt)' : 'transparent' }}
          >
            This Week
          </button>
        </div>

        {!compact && (
          <button onClick={toggleTodoPanel} className="text-sm flex items-center gap-1">
            {todoPanelCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            {todoPanelCollapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-progressTrack)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${completionPct}%`, background: 'var(--color-progress)' }}
        />
      </div>
      <p className="text-xs" style={{ color: 'var(--color-textMuted)' }}>
        {Math.round(completionPct)}% completed
      </p>

      {!compact && !todoPanelCollapsed && <AddTodo tab={tab} />}

      {!compact && !todoPanelCollapsed && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <label className="flex items-center gap-1">
            <Filter size={14} /> Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as 'all' | 'high' | 'medium' | 'low')}
            className="px-2 py-1 border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | TodoStatus)}
            className="px-2 py-1 border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surfaceAlt)' }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      )}

      <AnimatePresence>
        {compact || !todoPanelCollapsed ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={visibleTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
              <motion.div layout className="space-y-2">
                {visibleTodos.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>
                    No todos in this tab.
                  </p>
                ) : (
                  visibleTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
                )}
              </motion.div>
            </SortableContext>
          </DndContext>
        ) : null}
      </AnimatePresence>

      {!compact && (
        <button
          onClick={clearCompleted}
          className="text-sm px-3 py-2 border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Clear completed
        </button>
      )}
    </div>
  )
}
