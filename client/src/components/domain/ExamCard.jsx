import { daysUntil, formatDate } from '../../utils/format'
import { subjects } from '../../data/subjects'

export function ExamCard({ exam }) {
  const subject = subjects.find((s) => s.id === exam.subjectId)
  return (
    <article className="flex items-baseline justify-between gap-4 border-t border-line py-3">
      <div>
        <p className="font-medium text-ink">{subject?.name ?? exam.subjectId}</p>
        <p className="text-xs text-ink-3">
          {formatDate(exam.date)} · {exam.time} · {exam.venue}
        </p>
      </div>
      <p className="tabular text-sm font-semibold text-ink">{daysUntil(exam.date)}d</p>
    </article>
  )
}
