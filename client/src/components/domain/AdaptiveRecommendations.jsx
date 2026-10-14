import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Clock, ArrowRight, BookOpen, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import { api } from '../../services/api'
import { useAppState } from '../../context/AppState'

const PRIORITY_STYLES = {
  HIGH: {
    bg: 'var(--color-high-bg)',
    text: 'var(--color-high)',
    border: 'var(--color-high)',
    icon: <AlertTriangle size={14} />,
  },
  MEDIUM: {
    bg: 'var(--color-med-bg)',
    text: 'var(--color-med)',
    border: 'var(--color-med)',
    icon: <Target size={14} />,
  },
  LOW: {
    bg: 'var(--color-success-bg, rgba(34,197,94,0.1))',
    text: 'var(--color-success, #22c55e)',
    border: 'var(--color-success, #22c55e)',
    icon: <CheckCircle size={14} />,
  },
}

const CLASSIFICATION_ICONS = {
  weak: { icon: '🔴', label: 'Weak' },
  medium: { icon: '🟡', label: 'Medium' },
  strong: { icon: '🟢', label: 'Strong' },
  untested: { icon: '⚪', label: 'Not tested' },
}

export function AdaptiveRecommendations() {
  const { session } = useAppState()
  const [recommendations, setRecommendations] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.token) return

    async function load() {
      try {
        const result = await api.get('/ai/recommendations?limit=5')
        console.log('[Recommendations] API response:', result)
        if (result?.recommendations) {
          setRecommendations(result.recommendations)
        }
        if (result?.summary) {
          setSummary(result.summary)
        }
      } catch (err) {
        console.error('[Recommendations] Failed to load:', err.message)
        setError('Could not load recommendations')
      }
      setLoading(false)
    }

    load()
  }, [session?.token])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-48 animate-pulse rounded bg-surface" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    )
  }

  if (error || recommendations.length === 0) {
    return null // Don't show empty state — dashboard handles this gracefully
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      {summary && summary.total > 0 && (
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-3">
          <span className="flex items-center gap-1">
            <span>🔴</span> {summary.weak} weak
          </span>
          <span className="flex items-center gap-1">
            <span>🟡</span> {summary.medium} medium
          </span>
          <span className="flex items-center gap-1">
            <span>🟢</span> {summary.strong} strong
          </span>
          <span className="flex items-center gap-1">
            <span>⚪</span> {summary.untested} untested
          </span>
          {summary.avgAccuracy > 0 && (
            <span className="font-medium text-ink-2">
              Avg: {summary.avgAccuracy}%
            </span>
          )}
        </div>
      )}

      {/* Recommendation list */}
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={`${rec.subject}-${rec.topic}`} rec={rec} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

function RecommendationCard({ rec, rank }) {
  const priorityStyle = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.MEDIUM
  const classInfo = CLASSIFICATION_ICONS[rec.classification] || CLASSIFICATION_ICONS.untested

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05, duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:translate-x-1"
      style={{
        background: 'var(--color-card)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
      }}
    >
      {/* Priority indicator */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Rank number */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-ink-3" style={{ background: 'var(--color-surface)' }}>
              {rank}
            </span>

            {/* Priority badge */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: priorityStyle.bg, color: priorityStyle.text }}
            >
              {priorityStyle.icon}
              {rec.priority}
            </span>

            {/* Classification badge */}
            <span className="text-[11px] text-ink-3">
              {classInfo.icon} {classInfo.label}
            </span>
          </div>

          {/* Subject → Topic */}
          <div className="mt-2">
            <p className="text-sm font-medium text-ink truncate">{rec.subject}</p>
            <p className="text-sm text-ink-2 truncate">{rec.topic}</p>
          </div>

          {/* Stats row */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-3">
            {rec.accuracy != null && (
              <span className="flex items-center gap-1">
                <Target size={11} />
                {rec.accuracy}%
              </span>
            )}
            {rec.daysSinceStudied != null && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {rec.daysSinceStudied === 0 ? 'Today' : `${rec.daysSinceStudied}d ago`}
              </span>
            )}
            {rec.totalAttempts > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {rec.totalAttempts} attempt{rec.totalAttempts !== 1 ? 's' : ''}
              </span>
            )}
            {rec.estimatedMinutes && (
              <span>~{rec.estimatedMinutes}min</span>
            )}
          </div>

          {/* Reason */}
          {rec.reasons?.length > 0 && (
            <p className="mt-2 text-[11px] text-ink-3 leading-relaxed line-clamp-2">
              {rec.reasons[0]}
            </p>
          )}

          {/* Suggested action */}
          {rec.suggestedAction && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-medium text-accent-2">
                → {rec.suggestedAction.action}
              </span>
              <span className="text-[10px] text-ink-3">
                ({rec.suggestedAction.questions} questions)
              </span>
            </div>
          )}
        </div>

        {/* Action arrow */}
        <Link
          to={`/quiz`}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-ink-3 transition-all duration-200 hover:text-accent-2 hover:scale-110"
          style={{ background: 'var(--color-surface)' }}
        >
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}
