import { motion } from 'framer-motion'
import { CountUp } from './CountUp'

export function ProgressRing({ value, size = 88, stroke = 7, label, ink = false }) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c
  const color = ink ? '#e8eaf0' : '#6366f1'
  const track = ink ? 'rgba(232, 234, 240, 0.1)' : 'rgba(148, 163, 184, 0.08)'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Subtle glow behind */}
      {!ink && (
        <div
          className="absolute rounded-full blur-xl"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'rgba(99, 102, 241, 0.08)',
          }}
        />
      )}
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className={`absolute text-center ${ink ? 'text-ink' : 'text-ink'}`}>
        <div className="tabular text-lg font-semibold leading-none">
          <CountUp to={clamped} suffix="%" />
        </div>
        {label ? (
          <div className={`mt-0.5 text-[10px] uppercase tracking-wider ${ink ? 'text-ink-2' : 'text-ink-3'}`}>{label}</div>
        ) : null}
      </div>
    </div>
  )
}
