import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  seconds: number
}

export function SessionTimer({ seconds }: Props) {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="font-mono text-3xl md:text-5xl tracking-[0.3em] flex items-center justify-center gap-2 my-5">
      {[hh, mm, ss].map((value, index) => (
        <div key={index} className="min-w-[80px] text-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
