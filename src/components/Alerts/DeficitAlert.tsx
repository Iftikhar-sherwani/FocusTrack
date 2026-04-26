import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

type Props = {
  show: boolean
  hoursBehind: number
  message: string
  onDismiss: () => void
}

export function DeficitAlert({ show, hoursBehind, message, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: [1, 1.015, 1] }}
          exit={{ y: -120, opacity: 0 }}
          transition={{
            y: { duration: 0.35 },
            opacity: { duration: 0.35 },
            scale: { duration: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 10 },
          }}
          className="mb-4 border px-4 py-3 flex items-center justify-between gap-3"
          style={{
            background: 'var(--color-danger)',
            borderColor: 'var(--color-danger)',
            color: '#fff',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">{hoursBehind.toFixed(1)} hours behind goal</p>
              <p className="text-sm opacity-90">{message}</p>
            </div>
          </div>
          <button onClick={onDismiss} className="p-1 opacity-85 hover:opacity-100" aria-label="Dismiss alert">
            <X size={18} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
