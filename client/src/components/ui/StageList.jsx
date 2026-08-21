import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function StageList({ stages, current, complete }) {
  return (
    <ol className="mt-6 space-y-3">
      {stages.map((stage, i) => {
        const done = complete || i < current
        const active = !complete && i === current
        return (
          <motion.li
            key={stage}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 text-sm"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                done ? 'bg-ink text-canvas' : active ? 'border border-accent' : 'border border-line'
              }`}
            >
              {done ? <Check size={12} /> : active ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> : null}
            </span>
            <span className={done || active ? 'text-ink' : 'text-ink-3'}>{stage}</span>
          </motion.li>
        )
      })}
    </ol>
  )
}
