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
import { getAnalytics, getSubjects, getProgress, getReadiness } from '../services/catalog'

export function AnalyticsPage() {
  const { masteryTrend, studyHours, predictedReadiness, quizAccuracy, topicPerformance, improvementRate } =
    getAnalytics()
  const subjects = getSubjects()
  const progress = getProgress()
  const readiness = getReadiness()

  return (
    <div>
      <PageHeader
        eyebrow="Understand"
        title="Numbers that change what you study next."
        description="Each chart answers a preparation question. None of these are predicted exam marks."
      />

      <div className="space-y-14">
        <ChartCard title="Overall mastery trend" question="Is readiness compounding, or stalling?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={masteryTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="overall" stroke="#4338ca" strokeWidth={2} name="Overall" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject-wise mastery" question="Which paper is the bottleneck?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects} layout="vertical" margin={{ left: 28 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="mastery" fill="#4338ca" name="Mastery %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Topic-wise performance" question="Where is accuracy too low for the weightage?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicPerformance}>
              <XAxis dataKey="topic" tick={{ fontSize: 10 }} stroke="#6b7280" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#141821" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quiz accuracy over time" question="Are assessments improving after replans?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quizAccuracy}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[40, 80]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#4338ca" strokeWidth={2} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Planned vs actual study time" question="Where did the calendar leak?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studyHours}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="planned" fill="#ddd6c8" name="Planned" />
              <Bar dataKey="actual" fill="#4338ca" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Improvement rate" question="Is weekly gain accelerating before the first paper?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={improvementRate}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#0f766e" strokeWidth={2} name="Gain (pts)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Exam readiness trajectory" question="If this pace holds, where is preparation readiness on exam morning?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictedReadiness}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4338ca" strokeWidth={2} name="Readiness %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak topics</h2>
          <ul className="mt-3">
            {progress.weakTopics.map((t) => (
              <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular">{t.mastery}%</span>
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
                <span className="tabular">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Preparation readiness</h2>
        <div className="mt-5 space-y-4">
          {readiness.map((r) => (
            <ProgressBar key={r.subjectId} value={r.overall} label={`${r.name} — ${r.statusLabel}`} />
          ))}
        </div>
      </section>
    </div>
  )
}
