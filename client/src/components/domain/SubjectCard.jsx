import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { daysUntil, formatDate } from '../../utils/format'

const toneMap = { high: 'high', medium: 'medium', low: 'low' }

export function SubjectCard({ subject, included = true }) {
  const days = daysUntil(subject.examDate)
  return (
    <motion.article
      className="card card-hover mb-3 p-5"
      data-cursor="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-ink-3">{subject.code}</p>
          <h3 className="mt-0.5 text-lg font-semibold text-ink">{subject.fullName}</h3>
          {!included ? <p className="mt-1 text-xs text-ink-3">Entered, but not selected for the optimizer</p> : null}
        </div>
        <Badge tone={toneMap[subject.priority]}>{subject.priority} priority</Badge>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <ProgressBar value={subject.progress} label="Readiness" />
        <div>
          <p className="text-xs text-ink-3">Exam</p>
          <p className="mt-1 tabular text-sm font-medium text-ink">
            {formatDate(subject.examDate)} · {days} days
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-3">Weak topics</p>
          <p className="mt-1 text-sm text-ink-2">{(subject.weakTopics || []).join(', ') || '—'}</p>
        </div>
      </div>
      <Link
        to="/syllabus"
        className="mt-4 inline-block text-sm font-medium text-accent-2 hover:text-accent transition-colors"
      >
        Open syllabus →
      </Link>
    </motion.article>
  )
}
