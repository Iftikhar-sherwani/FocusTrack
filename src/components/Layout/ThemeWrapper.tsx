import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useThemeStore } from '../../store/useThemeStore'

type Props = {
  children: ReactNode
}

export function ThemeWrapper({ children }: Props) {
  const theme = useThemeStore((state) => state.activeTheme)
  const applyThemeToDOM = useThemeStore((state) => state.applyThemeToDOM)

  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme, applyThemeToDOM])

  return (
    <motion.div
      className="min-h-screen"
      animate={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
