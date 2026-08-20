import { cn } from '../../utils/cn'

export function RiskAlert({ risk }) {
  return (
    <article
      className={cn(
        'border-l-2 py-3 pl-3',
        risk.level === 'high' ? 'border-l-risk' : 'border-l-med',
      )}
    >
      <h3 className="text-sm font-semibold text-ink">{risk.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{risk.body}</p>
    </article>
  )
}
