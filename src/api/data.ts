import type { DayLog, Todo } from '../types'
import { apiFetch } from './client'

export type SyncPayload = {
  workLogs: DayLog[]
  todos: Todo[]
  settings: Record<string, unknown>
}

export type SyncResponse = {
  workLogs: DayLog[]
  todos: Todo[]
  settings: Record<string, unknown> | null
}

export const fetchSync = (token: string) =>
  apiFetch<SyncResponse>('/data/sync', {}, token)

export const pushSync = (token: string, payload: SyncPayload) =>
  apiFetch<{ ok: boolean }>('/data/sync', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
