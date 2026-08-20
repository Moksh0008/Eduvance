import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function PriorityCard({ item }) {
  return (
    <motion.section
      layout
      className="relative overflow-hidden border border-ink bg-ink px-6 py-7 text-canvas sm:px-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
        What should I study now?
      </p>
      <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
        {item.subject}
        <span className="text-canvas/50"> → </span>
        {item.topic}
      </h2>
      <div className="mt-6 flex flex-wrap items-end gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-canvas/50">Priority score</p>
          <p className="tabular text-5xl font-semibold leading-none">{item.priorityScore}</p>
          <p className="mt-1 text-sm text-canvas/50">/ 100</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-canvas/50">Estimated time</p>
          <p className="mt-1 text-xl font-medium">{item.estimatedLabel}</p>
        </div>
      </div>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {item.reasons.map((reason) => (
          <li key={reason} className="flex items-start gap-2 text-sm text-canvas/80">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
            {reason}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button as={Link} to="/study-session" variant="accent">
          Start Study Session
        </Button>
        <Badge tone="accent">High impact</Badge>
      </div>
    </motion.section>
  )
}
