import { daysUntil, formatDate } from '../../utils/format'
import { subjects as demoSubjects } from '../../data/subjects'

export function ExamCard({ exam }) {
  const fallback = demoSubjects.find((s) => s.id === exam.subjectId)
  const name = exam.name || fallback?.name || exam.subjectId
  const days = daysUntil(exam.date)
  const urgency = days <= 7 ? 'text-high' : days <= 14 ? 'text-med' : 'text-ink'

  return (
    <article className="card mb-2 flex items-baseline justify-between gap-4 p-4">
      <div>
        <p className="font-medium text-ink">{name}</p>
        <p className="text-xs text-ink-3">
          {formatDate(exam.date)} · {exam.time || '—'} · {exam.venue || '—'}
        </p>
      </div>
      <p className={`tabular text-sm font-semibold ${urgency}`}>{days}d</p>
    </article>
  )
}
