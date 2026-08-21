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

export function ProgressPage() {
  const data = useAppData()
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

      <div className="grid gap-8 sm:grid-cols-3">
        <StatCard label="Study consistency" value={`${progress.hoursThisWeek}h`} hint={`Target ${progress.hoursTarget}h`} />
        <StatCard label="Topic completion" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} />
        <StatCard label="Quiz performance" value={`${progress.quizAverage}%`} />
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Subject progress</h2>
        <div className="mt-5 space-y-5">
          {subjects.map((s) => (
            <ProgressBar key={s.id} value={s.progress} label={`${s.name}${s.fullName && s.fullName !== s.name ? ` — ${s.fullName}` : ''}`} />
          ))}
        </div>
      </section>

      {!data.isDemo ? (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Topic completion</h2>
          <ul className="mt-3">
            {topics.map((t) => {
              const done = (data.quizResults || []).some((q) => q.topic === t.name && q.score >= 70)
              return (
                <li key={t.id} className="flex justify-between border-t border-line py-3 text-sm" data-cursor="topic">
                  <span>
                    {t.subjectName} → {t.name}
                  </span>
                  <span className={done ? 'text-low' : 'text-ink-3'}>{done ? '✓ Evidence' : 'Open'}</span>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {!data.isDemo && !topics.length ? (
        <div className="mt-10">
          <EmptyState
            title="Add syllabus topics to generate topic-level planning."
            body="Subjects from setup appear above. Topic completion unlocks after you enter units in Edit Preparation."
          />
        </div>
      ) : null}

      {!data.isDemo && !(data.analytics?.history || []).length ? (
        <div className="mt-10">
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Progress already uses your subjects. Accuracy and weak areas appear after a quiz."
          />
        </div>
      ) : null}
      {trend?.length ? (
        <div className="mt-12">
          <ChartCard title="Performance trend" question="Is accuracy rising after each quiz?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey={data.isDemo ? 'day' : 'attempt'} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={data.isDemo ? 'overall' : 'accuracy'}
                  stroke="#4338ca"
                  strokeWidth={2}
                  dot={false}
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak areas</h2>
          <ul className="mt-3">
            {(progress.weakTopics || []).map((t) => (
              <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Held topics</h2>
          <ul className="mt-3">
            {(progress.strongTopics || []).map((t) => (
              <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
