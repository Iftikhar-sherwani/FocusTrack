import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { Todo, TodoStatus } from '../types'

type TodoStore = {
  todos: Todo[]
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'order'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleStatus: (id: string) => void
  reorderTodos: (newOrder: Todo[]) => void
  clearCompleted: () => void
  clearAllData: () => void
  checkRecurringTodos: () => void
}

const nextStatus: Record<TodoStatus, TodoStatus> = {
  pending: 'in-progress',
  'in-progress': 'done',
  done: 'pending',
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
              order: state.todos.length,
            },
          ],
        })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => {
          const todayStr = format(new Date(), 'yyyy-MM-dd')
          return {
            todos: state.todos.map((todo) => {
              if (todo.id !== id) return todo
              const newStatus = nextStatus[todo.status]
              const updates: Partial<Todo> = { status: newStatus }
              if (newStatus === 'done' && todo.daysOfWeek && todo.daysOfWeek.length > 0) {
                updates.lastCompletedDate = todayStr
              }
              return { ...todo, ...updates }
            }),
          }
        }),
      reorderTodos: (newOrder) =>
        set({
          todos: newOrder.map((todo, index) => ({ ...todo, order: index })),
        }),
      clearCompleted: () =>
        set(() => ({
          todos: get().todos.filter((todo) => todo.status !== 'done'),
        })),
      clearAllData: () => set({ todos: [] }),
      checkRecurringTodos: () => {
        set((state) => {
          const todayStr = format(new Date(), 'yyyy-MM-dd')
          const todayDay = new Date().getDay()
          let changed = false
          
          const newTodos = state.todos.map((todo) => {
            if (todo.status === 'done' && todo.daysOfWeek && todo.daysOfWeek.includes(todayDay)) {
              if (todo.lastCompletedDate !== todayStr) {
                changed = true
                return { ...todo, status: 'pending' as TodoStatus }
              }
            }
            return todo
          })
          
          return changed ? { todos: newTodos } : state
        })
      },
    }),
    {
      name: 'focus-todo-store',
    },
  ),
)
