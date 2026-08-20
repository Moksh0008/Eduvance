import { cn } from '../../utils/cn'

export function ProgressBar({ value, className, barClassName, label }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1.5 flex justify-between text-xs text-ink-3">
          <span>{label}</span>
          <span className="tabular text-ink-2">{clamped}%</span>
        </div>
      ) : null}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-2"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full bg-accent transition-[width] duration-500', barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
