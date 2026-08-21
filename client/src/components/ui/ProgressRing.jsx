import { motion } from 'framer-motion'
import { CountUp } from './CountUp'

export function ProgressRing({ value, size = 88, stroke = 7, label, ink = false }) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Subtle glow behind */}
      {!ink && (
        <div
          className="absolute rounded-full blur-xl"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'var(--color-accent-soft)',
          }}
        />
      )}
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ink ? 'var(--color-ink)' : 'var(--color-accent)'}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center text-ink">
        <div className="tabular text-lg font-semibold leading-none">
          <CountUp to={clamped} suffix="%" />
        </div>
        {label ? (
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">{label}</div>
        ) : null}
      </div>
    </div>
  )
}
