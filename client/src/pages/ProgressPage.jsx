import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ChartCard } from '../components/ui/ChartCard'
import { DemoBanner } from '../components/domain/ModeBanners'
import { EmptyState } from '../components/ui/EmptyState'
import { getProgress, getAnalytics } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'
import { useTheme } from '../context/ThemeContext'

function useChartColors() {
  const { isDark } = useTheme()
  return {
    line: isDark ? '#818cf8' : '#5558e6',
    axis: isDark ? '#64748b' : '#7a8098',
    tooltipBg: isDark ? '#1a2340' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(148,163,184,0.15)' : 'rgba(26,29,46,0.1)',
    tooltipText: isDark ? '#e8eaf0' : '#1a1d2e',
  }
}

function ThemeTooltip({ active, payload, label }) {
  const colors = useChartColors()
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        background: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        color: colors.tooltipText,
      }}
    >
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: colors.line }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

export function ProgressPage() {
  const data = useAppData()
  const colors = useChartColors()
  const progress = data.isDemo ? getProgress() : data.progress
  const subjects = data.subjects
  const trend = data.isDemo ? getAnalytics().masteryTrend : data.analytics?.trend
  const topics = data.topics || []

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Progress"
        title={`Overall preparation: ${progress.overall}%`}
        description="Syllabus, topics, quizzes, and consistency — all from the same preparation state."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Study consistency" value={`${progress.hoursThisWeek}h`} hint={`Target ${progress.hoursTarget}h`} />
        <StatCard label="Topic completion" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} />
        <StatCard label="Quiz performance" value={`${progress.quizAverage}%`} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Subject progress</h2>
        <div className="mt-4 space-y-4">
          {subjects.map((s) => (
            <ProgressBar key={s.id} value={s.progress} label={`${s.name}${s.fullName && s.fullName !== s.name ? ` — ${s.fullName}` : ''}`} />
          ))}
        </div>
      </section>

      {!data.isDemo ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Topic completion</h2>
          <ul className="mt-3">
            {topics.map((t) => {
              const done = (data.quizResults || []).some((q) => q.topic === t.name && q.score >= 70)
              return (
                <li key={t.id} className="card mb-2 flex justify-between p-3 text-sm" data-cursor="topic">
                  <span>
                    {t.subjectName} → {t.name}
                  </span>
                  <span className={done ? 'text-success' : 'text-ink-3'}>{done ? '✓ Evidence' : 'Open'}</span>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {!data.isDemo && !topics.length ? (
        <div className="mt-6">
          <EmptyState
            title="Add syllabus topics to generate topic-level planning."
            body="Subjects from setup appear above. Topic completion unlocks after you enter units in Edit Preparation."
          />
        </div>
      ) : null}

      {!data.isDemo && !(data.analytics?.history || []).length ? (
        <div className="mt-6">
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Progress already uses your subjects. Accuracy and weak areas appear after a quiz."
          />
        </div>
      ) : null}

      {trend?.length ? (
        <div className="mt-8">
          <ChartCard title="Performance trend" question="Is accuracy rising after each quiz?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey={data.isDemo ? 'day' : 'attempt'} tick={{ fontSize: 11 }} stroke={colors.axis} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke={colors.axis} />
                <Tooltip content={<ThemeTooltip />} />
                <Line
                  type="monotone"
                  dataKey={data.isDemo ? 'overall' : 'accuracy'}
                  stroke={colors.line}
                  strokeWidth={2}
                  dot={false}
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak areas</h2>
          <ul className="mt-3">
            {(progress.weakTopics || []).map((t) => (
              <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium text-risk">{t.mastery}%</span>
              </li>
            ))}
            {!(progress.weakTopics || []).length && (
              <li className="py-3 text-sm text-ink-3">No weak areas identified yet.</li>
            )}
          </ul>
        </section>
        <section className="card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Strongest subjects</h2>
          <ul className="mt-3">
            {(progress.strongTopics || []).map((t) => (
              <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium text-success">{t.mastery}%</span>
              </li>
            ))}
            {!(progress.strongTopics || []).length && (
              <li className="py-3 text-sm text-ink-3">Complete quizzes to identify strong subjects.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
