import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { PageHeader } from '../components/ui/PageHeader'
import { ChartCard } from '../components/ui/ChartCard'
import { getAnalytics, getSubjects, getInsights } from '../services/catalog'

export function AnalyticsPage() {
  const { masteryTrend, predictedReadiness } = getAnalytics()
  const subjects = getSubjects()
  const insights = getInsights()

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Questions the numbers should answer."
        description="Each chart exists to support a preparation decision — not to decorate the dashboard."
      />

      <div className="space-y-12">
        <ChartCard title="Predicted readiness" question="If this pace holds, where is readiness on each exam morning?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictedReadiness}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4338ca" strokeWidth={2} name="Predicted %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject readiness" question="Which paper is still the bottleneck?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects} layout="vertical" margin={{ left: 24 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" width={50} />
              <Tooltip />
              <Bar dataKey="progress" fill="#4338ca" name="Readiness %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Accuracy trajectory" question="Is DBMS improving fast enough for Monday?">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={masteryTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="dbms" stroke="#4338ca" strokeWidth={2} name="DBMS" />
              <Line type="monotone" dataKey="java" stroke="#141821" strokeWidth={1.5} name="Java" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Interpreted insights</h2>
        <div className="mt-4 space-y-6">
          {insights.map((i) => (
            <article key={i.id} className="border-l-2 border-l-accent pl-4">
              <h3 className="font-medium text-ink">{i.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{i.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
