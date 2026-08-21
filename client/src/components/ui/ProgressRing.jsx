import { motion } from 'framer-motion'
import { CountUp } from './CountUp'

export function ProgressRing({ value, size = 88, stroke = 7, label, ink = false }) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c
  const color = ink ? '#EDE9E0' : '#4338ca'
  const track = ink ? 'rgba(237,233,224,0.2)' : '#ddd6c8'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
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
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className={`absolute text-center ${ink ? 'text-canvas' : 'text-ink'}`}>
        <div className="tabular text-lg font-semibold leading-none">
          <CountUp to={clamped} suffix="%" />
        </div>
        {label ? <div className={`mt-0.5 text-[10px] uppercase tracking-wider ${ink ? 'text-canvas/50' : 'text-ink-3'}`}>{label}</div> : null}
      </div>
    </div>
  )
}
