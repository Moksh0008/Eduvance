import { cn } from '../../utils/cn'

export function PriorityIndicator({ level, score }) {
  const derived =
    level || (score >= 85 ? 'HIGH' : score >= 70 ? 'MEDIUM' : score != null ? 'LOW' : 'MEDIUM')
  const tone =
    derived === 'HIGH' ? 'bg-high-bg text-high' : derived === 'LOW' ? 'bg-low-bg text-low' : 'bg-med-bg text-med'
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider', tone)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', derived === 'HIGH' ? 'animate-pulse bg-high' : 'bg-current')} />
      {score != null ? <span className="tabular">{score}</span> : derived}
    </span>
  )
}
