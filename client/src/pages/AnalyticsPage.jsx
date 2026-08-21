import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { PageHeader } from '../components/ui/PageHeader'
import { ChartCard } from '../components/ui/ChartCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { DemoBanner } from '../components/domain/ModeBanners'
import { EmptyState } from '../components/ui/EmptyState'
import { getAnalytics, getProgress, getReadiness } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'

export function AnalyticsPage() {
  const data = useAppData()
  const catalog = getAnalytics()
  const progress = data.isDemo ? getProgress() : data.progress
  const readiness = data.isDemo ? getReadiness() : data.readiness
  const analytics = data.analytics || {}
  const trend = data.isDemo ? catalog.quizAccuracy : analytics.trend
  const subjectBars = data.isDemo
    ? data.subjects
    : analytics.subjectAccuracy?.length
      ? analytics.subjectAccuracy.map((s) => ({ name: s.name, mastery: s.accuracy }))
      : data.subjects
  const topicBars = data.isDemo
    ? catalog.topicPerformance
    : (analytics.topicAccuracy || []).map((t) => ({ topic: t.topic, accuracy: t.accuracy }))

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Understand"
        title="Numbers that change what you study next."
        description="Charts read the same quiz results as Dashboard and Planner. Nothing here asks for setup again."
      />

      {!data.isDemo && !analytics.history?.length ? (
        <div className="mt-6">
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Operating subjects and topics are already loaded from setup. Charts fill in after the first attempt."
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-14">
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label="Overall accuracy" value={`${analytics.overallAccuracy ?? progress.quizAverage}%`} />
          <Stat label="Quizzes logged" value={String(analytics.history?.length || 0)} />
          <Stat label="Weak topics" value={String(progress.weakTopics?.length || 0)} />
        </div>

        <ChartCard title="Subject accuracy" question="Which paper is the bottleneck?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectBars} layout="vertical" margin={{ left: 28 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="mastery" fill="#4338ca" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {topicBars?.length ? (
          <ChartCard title="Topic accuracy" question="Where is accuracy too low?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicBars}>
                <XAxis dataKey="topic" tick={{ fontSize: 10 }} stroke="#6b7280" interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#141821" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : null}

        {trend?.length ? (
          <ChartCard title="Improvement trend" question="Are assessments improving after replans?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey={data.isDemo ? 'day' : 'attempt'} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#4338ca" strokeWidth={2} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : null}

        {data.isDemo ? (
          <ChartCard title="Overall mastery trend" question="Is readiness compounding, or stalling?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={catalog.masteryTrend}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="overall" stroke="#4338ca" strokeWidth={2} name="Overall" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : null}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weakest subjects</h2>
          <ul className="mt-3">
            {(analytics.weakest || []).map((t) => (
              <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                <span>{t.name}</span>
                <span className="tabular">{t.accuracy}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Strongest subjects</h2>
          <ul className="mt-3">
            {(analytics.strongest || []).map((t) => (
              <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                <span>{t.name}</span>
                <span className="tabular">{t.accuracy}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Quiz history</h2>
        <ul className="mt-3">
          {(analytics.history || []).slice().reverse().map((q, i) => (
            <li key={`${q.at}-${i}`} className="flex justify-between border-t border-line py-3 text-sm">
              <span>
                {q.subject} → {q.topic}
              </span>
              <span className="tabular">{q.score}%</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak topics</h2>
          <ul className="mt-3">
            {(progress.weakTopics || []).map((t) => (
              <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Preparation readiness</h2>
          <div className="mt-5 space-y-4">
            {readiness.map((r) => (
              <ProgressBar key={r.subjectId} value={r.overall} label={`${r.name} — ${r.statusLabel}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="text-[11px] uppercase tracking-wider text-ink-3">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular">{value}</p>
    </div>
  )
}
