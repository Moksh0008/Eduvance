import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { CountUp } from './CountUp'

export function ProgressBar({ value, className, barClassName, label, animateValue = true }) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-2 flex justify-between text-xs text-ink-3">
          <span className="font-medium">{label}</span>
          <span className="tabular text-ink-2">
            {animateValue ? <CountUp to={clamped} suffix="%" duration={700} /> : `${clamped}%`}
          </span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--color-surface-2)' }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn('h-full rounded-full relative', barClassName)}
          style={{
            background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-2))',
            boxShadow: '0 0 12px var(--color-accent-glow)',
          }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shimmer effect inside the bar */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s ease-in-out infinite',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
