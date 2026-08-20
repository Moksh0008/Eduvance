import { cn } from '../../utils/cn'
import { priorityLabel } from '../../utils/format'

export function PriorityIndicator({ score, className }) {
  const label = priorityLabel(score)
  const tone =
    label === 'High' ? 'bg-high' : label === 'Medium' ? 'bg-med' : 'bg-low'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', tone)} aria-hidden="true" />
      <span className="tabular text-sm font-medium text-ink">{score}</span>
      <span className="text-xs text-ink-3">{label}</span>
    </div>
  )
}
