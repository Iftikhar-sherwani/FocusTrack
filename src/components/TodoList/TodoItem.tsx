import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import type { Todo } from '../../types'
import { useTodoStore } from '../../store/useTodoStore'

const priorityColor = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
}

type Props = {
  todo: Todo
}

export function TodoItem({ todo }: Props) {
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const toggleStatus = useTodoStore((state) => state.toggleStatus)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style, borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border p-3"
      role="button"
      onClick={() => toggleStatus(todo.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          toggleStatus(todo.id)
        }
      }}
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            onClick={(event) => event.stopPropagation()}
            className="cursor-grab mt-1"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <div>
            <p
              className="font-medium"
              style={{
                textDecoration: todo.status === 'done' ? 'line-through' : 'none',
                opacity: todo.status === 'done' ? 0.6 : 1,
              }}
            >
              {todo.title}
            </p>
            <div className="flex gap-2 text-xs mt-1" style={{ color: 'var(--color-textMuted)' }}>
              <span className="inline-flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: priorityColor[todo.priority] }}
                />
                {todo.priority}
              </span>
              <span>{todo.status}</span>
              {todo.estimatedMinutes ? <span>{todo.estimatedMinutes}m</span> : null}
              {todo.dueDate ? <span>Due {todo.dueDate}</span> : null}
            </div>
          </div>
        </div>

        <button
          className="p-1"
          aria-label="Delete todo"
          onClick={(event) => {
            event.stopPropagation()
            deleteTodo(todo.id)
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  )
}
