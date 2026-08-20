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
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ChartCard } from '../components/ui/ChartCard'
import { getProgress, getSubjects, getAnalytics } from '../services/catalog'

export function ProgressPage() {
  const progress = getProgress()
  const subjects = getSubjects()
  const { masteryTrend } = getAnalytics()

  return (
    <div>
      <PageHeader
        eyebrow="Progress"
        title={`Overall preparation: ${progress.overall}%`}
        description="Readiness by subject, hours vs plan, and the topics that still threaten the next paper."
      />

      <div className="grid gap-8 sm:grid-cols-3">
        <StatCard label="Study hours" value={`${progress.hoursThisWeek}h`} hint={`Target ${progress.hoursTarget}h`} />
        <StatCard
          label="Topic completion"
          value={`${progress.topicsCompleted}/${progress.topicsTotal}`}
        />
        <StatCard label="Quiz performance" value={`${progress.quizAverage}%`} />
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Subject progress</h2>
        <div className="mt-5 space-y-5">
          {subjects.map((s) => (
            <ProgressBar key={s.id} value={s.progress} label={`${s.name} — ${s.fullName}`} />
          ))}
        </div>
      </section>

      <div className="mt-12">
        <ChartCard title="Mastery trend" question="Is overall readiness actually rising, or only one subject?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={masteryTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="overall" stroke="#4338ca" strokeWidth={2} dot={false} name="Overall" />
              <Line type="monotone" dataKey="dbms" stroke="#141821" strokeWidth={1.5} dot={false} name="DBMS" />
              <Line type="monotone" dataKey="dsa" stroke="#0f766e" strokeWidth={1.5} dot={false} name="DSA" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak topics</h2>
          <ul className="mt-3">
            {progress.weakTopics.map((t) => (
              <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Strong topics</h2>
          <ul className="mt-3">
            {progress.strongTopics.map((t) => (
              <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular font-medium">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-12">
        <ChartCard title="Hours this week" question="Where did planned time leak?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getAnalytics().studyHours}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="planned" fill="#ddd6c8" name="Planned" />
              <Bar dataKey="actual" fill="#4338ca" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
