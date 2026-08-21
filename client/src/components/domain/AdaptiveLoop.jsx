import { motion } from 'framer-motion'

const STEPS = ['Analyze', 'Prioritize', 'Plan', 'Study', 'Quiz', 'Evaluate', 'Replan']

export function AdaptiveLoop({ compact = false }) {
  return (
    <ol className={compact ? 'flex flex-wrap gap-x-3 gap-y-1 text-xs' : 'space-y-0'}>
      {STEPS.map((step, i) => (
        <motion.li
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 220, damping: 24 }}
          className={compact ? 'flex items-center gap-2 text-ink-2' : 'relative border-l border-ink py-2 pl-5'}
        >
          {!compact ? <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-ink" /> : null}
          <span className={compact ? '' : 'text-sm font-medium'}>{step}</span>
          {i < STEPS.length - 1 ? <span className="text-ink-3">{compact ? '→' : ''}</span> : null}
        </motion.li>
      ))}
    </ol>
  )
}
