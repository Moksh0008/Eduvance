import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'
import { PriorityIndicator } from './PriorityIndicator'

export function ScheduleCard({ item, onToggle, onMove, index, total }) {
  const kindTone = item.kind === 'Revise' ? 'low' : item.kind === 'Practice' ? 'medium' : 'accent'

  return (
    <article
      className={cn(
        'card mb-2 grid gap-3 border-l-2 py-4 pl-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center',
        item.changed ? 'border-l-accent bg-accent/[0.06]' : 'border-l-ink-3/20',
        item.done && 'opacity-50',
      )}
    >
      <p className="tabular text-sm font-medium text-ink">
        {item.start} — {item.end}
      </p>
      <div>
        <p className="text-xs text-ink-3">{item.subject}</p>
        <h3 className={cn('text-base font-semibold text-ink', item.done && 'line-through')}>{item.topic}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge tone={kindTone}>{item.kind}</Badge>
          <PriorityIndicator score={item.priority} />
          {item.changed ? <span className="text-xs font-medium text-accent-2">Replanned</span> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onMove ? (
          <>
            <button
              type="button"
              className="h-8 px-2 text-xs text-ink-3 hover:text-ink transition-colors"
              aria-label="Move earlier"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
            >
              Up
            </button>
            <button
              type="button"
              className="h-8 px-2 text-xs text-ink-3 hover:text-ink transition-colors"
              aria-label="Move later"
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
            >
              Down
            </button>
          </>
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded accent-accent"
            checked={item.done}
            onChange={() => onToggle?.(item.id)}
          />
          Done
        </label>
      </div>
    </article>
  )
}
