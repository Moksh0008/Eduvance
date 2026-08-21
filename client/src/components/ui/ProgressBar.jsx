import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { CountUp } from './CountUp'

export function ProgressBar({ value, className, barClassName, label, animateValue = true }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1.5 flex justify-between text-xs text-ink-3">
          <span>{label}</span>
          <span className="tabular text-ink-2">
            {animateValue ? <CountUp to={clamped} suffix="%" duration={700} /> : `${clamped}%`}
          </span>
        </div>
      ) : null}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-2"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn('h-full rounded-full bg-accent', barClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
