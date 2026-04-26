import type { AuthUser } from '../store/useAuthStore'
import { apiFetch } from './client'

export type AuthResponse = {
  token: string
  user: AuthUser
}

export const registerUser = (name: string, email: string, password: string) =>
  apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

export const loginUser = (email: string, password: string) =>
  apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
