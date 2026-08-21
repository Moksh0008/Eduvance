import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function StatCard({ label, value, hint, className, icon: Icon }) {
  return (
    <motion.div
      className={cn(
        'card card-hover group',
        className,
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</p>
          <p className="mt-2 tabular text-2xl font-semibold text-ink">{value}</p>
          {hint ? <p className="mt-1.5 text-xs text-ink-3">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-accent-soft p-2 transition-transform duration-200 group-hover:scale-110">
            <Icon size={18} className="text-accent-2" />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
