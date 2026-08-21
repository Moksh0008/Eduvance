import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { CountUp } from '../ui/CountUp'

export function PriorityCard({ item }) {
  return (
    <motion.section
      layout
      className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.12] via-surface to-surface px-6 py-8 sm:px-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/[0.08] blur-[80px]" />

      <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-2">
        What should I study now?
      </p>
      <h2 className="relative mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {item.subject}
        <span className="text-ink-3"> → </span>
        {item.topic}
      </h2>
      <div className="relative mt-8 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-3">Priority</p>
          <p className="mt-1 text-sm font-semibold tracking-wide text-ink">{item.priorityLabel || 'PRIORITY'}</p>
          {item.pending ? (
            <p className="mt-2 text-sm text-ink-3">Awaiting topic extraction</p>
          ) : (
            <>
              <p className="mt-1 tabular text-6xl font-semibold leading-none gradient-text">
                <CountUp to={item.priorityScore} duration={1100} />
              </p>
              <p className="mt-1 text-sm text-ink-3">/ 100{item.provisional ? ' · provisional' : ''}</p>
            </>
          )}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-3">Why now?</p>
          <ul className="mt-2 space-y-1.5">
            {item.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm text-ink-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-3">Estimated time</p>
          <p className="mt-1 text-xl font-medium text-ink">{item.estimatedLabel}</p>
        </div>
        <Button as={Link} to="/study-session" variant="accent" size="lg">
          Start Study Session
        </Button>
      </div>
    </motion.section>
  )
}
