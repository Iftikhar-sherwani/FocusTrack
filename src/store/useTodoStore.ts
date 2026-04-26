import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, status: nextStatus[todo.status] } : todo,
          ),
        })),
      reorderTodos: (newOrder) =>
        set({
          todos: newOrder.map((todo, index) => ({ ...todo, order: index })),
        }),
      clearCompleted: () =>
        set(() => ({
          todos: get().todos.filter((todo) => todo.status !== 'done'),
        })),
      clearAllData: () => set({ todos: [] }),
    }),
    {
      name: 'focus-todo-store',
    },
  ),
)
