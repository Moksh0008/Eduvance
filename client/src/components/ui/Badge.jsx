import { cn } from '../../utils/cn'

const tones = {
  default: 'bg-canvas-2 text-ink-2',
  accent: 'bg-accent-soft text-accent',
  high: 'bg-high-bg text-high',
  medium: 'bg-med-bg text-med',
  low: 'bg-low-bg text-low',
  risk: 'bg-risk-bg text-risk',
}

export function Badge({ tone = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
