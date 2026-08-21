import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export function PlanCompare({ delta }) {
  const max = Math.max(...delta.original.concat(delta.current).map((x) => x.hours))

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Adaptive plan</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">{delta.reason}</p>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <Column title="Original plan" rows={delta.original} max={max} muted />
        <Column title="Current plan" rows={delta.current} max={max} />
      </div>
    </section>
  )
}

function Column({ title, rows, max, muted }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-3">{title}</p>
      <ul className="mt-3 space-y-3">
        {rows.map((row) => (
          <li key={row.subject}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{row.subject}</span>
              <span className="tabular">{row.label}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-canvas-2">
              <motion.div
                className={cn('h-full rounded-full', muted ? 'bg-ink/25' : 'bg-accent')}
                initial={{ width: 0 }}
                whileInView={{ width: `${(row.hours / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RiskMonitor({ risks }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Preparation monitor</h2>
      <div className="mt-4 space-y-4">
        {risks.map((risk, i) => (
          <motion.article
            key={risk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 160, damping: 22 }}
            className={cn(
              'border-l-2 px-4 py-4',
              risk.level === 'high' ? 'border-l-risk bg-risk-bg/40' : 'border-l-med bg-med-bg/50',
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{risk.label}</p>
            <h3 className="mt-1 font-semibold text-ink">{risk.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{risk.body}</p>
            <Button as={Link} to={risk.to} size="sm" variant={risk.level === 'high' ? 'primary' : 'secondary'} className="mt-3">
              {risk.cta}
            </Button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
