import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { formatHours } from '../../utils/format'

export function TopicCard({ topic }) {
  const tone =
    topic.priority >= 80 ? 'high' : topic.priority >= 55 ? 'medium' : 'low'

  return (
    <article className="card grid gap-3 p-4 sm:grid-cols-12 sm:items-center">
      <div className="sm:col-span-3">
        <h4 className="font-medium text-ink">{topic.name}</h4>
        <Badge tone={tone} className="mt-1">
          {topic.status}
        </Badge>
      </div>
      <Metric label="Difficulty" value={topic.difficulty} />
      <Metric label="Weightage" value={`${topic.weightage}%`} />
      <div className="sm:col-span-3">
        <ProgressBar value={topic.mastery} label="Mastery" />
      </div>
      <Metric label="Priority" value={topic.priority} />
      <p className="text-xs text-ink-3 sm:col-span-1 sm:text-right">{formatHours(topic.estimatedMin)}</p>
    </article>
  )
}

function Metric({ label, value }) {
  return (
    <div className="sm:col-span-1">
      <p className="text-[10px] uppercase tracking-wider text-ink-3">{label}</p>
      <p className="tabular text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}
