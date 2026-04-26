import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser, registerUser } from '../../api/auth'
import { useAuthStore } from '../../store/useAuthStore'

type Props = {
  onSuccess: () => void
}

type Mode = 'login' | 'register'

export function AuthPage({ onSuccess }: Props) {
  const setAuth = useAuthStore((s) => s.setAuth)

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'password', string>>>({})

  const switchMode = (next: Mode) => {
    setMode(next)
    setFieldErrors({})
    setPassword('')
  }

  const validate = () => {
    const errors: typeof fieldErrors = {}
    if (mode === 'register' && name.trim().length < 1) {
      errors.name = 'Name is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email'
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const result =
        mode === 'register'
          ? await registerUser(name.trim(), email.trim(), password)
          : await loginUser(email.trim(), password)

      setAuth(result.token, result.user)
      toast.success(mode === 'register' ? `Welcome, ${result.user.name}!` : `Welcome back, ${result.user.name}!`)
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--app-bg)' }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            FocusTrack
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>
            Track every hour. Own every day.
          </p>
        </div>

        {/* Card */}
        <div
          className="border p-8"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Tab toggle */}
          <div
            className="flex mb-6 border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className="flex-1 py-2 text-sm font-semibold transition-colors capitalize"
                style={{
                  background: mode === m ? 'var(--color-accent)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--color-textMuted)',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, x: mode === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Name — register only */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--color-textMuted)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--color-textMuted)' }}
                    />
                    <input
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-9 pr-3 py-2.5 border text-sm outline-none focus:ring-1"
                      style={{
                        borderColor: fieldErrors.name ? 'var(--color-danger)' : 'var(--color-border)',
                        background: 'var(--color-surfaceAlt)',
                        color: 'var(--color-text)',
                        // @ts-ignore
                        '--tw-ring-color': 'var(--color-accent)',
                      }}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-textMuted)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--color-textMuted)' }}
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border text-sm outline-none focus:ring-1"
                    style={{
                      borderColor: fieldErrors.email ? 'var(--color-danger)' : 'var(--color-border)',
                      background: 'var(--color-surfaceAlt)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-textMuted)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--color-textMuted)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                    className="w-full pl-9 pr-10 py-2.5 border text-sm outline-none focus:ring-1"
                    style={{
                      borderColor: fieldErrors.password ? 'var(--color-danger)' : 'var(--color-border)',
                      background: 'var(--color-surfaceAlt)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-textMuted)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-bold tracking-wide transition-opacity disabled:opacity-60"
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                }}
              >
                {loading
                  ? 'Please wait…'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-textMuted)' }}>
          Your data is stored securely and tied to your account.
        </p>
      </motion.div>
    </div>
  )
}
