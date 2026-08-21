import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { ChartCard } from '../components/ui/ChartCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { DemoBanner } from '../components/domain/ModeBanners'
import { EmptyState } from '../components/ui/EmptyState'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { getAnalytics, getProgress, getReadiness } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'
import { useTheme } from '../context/ThemeContext'
import { useReducedMotion } from '../hooks/useReducedMotion'

function useChartColors() {
  const { isDark } = useTheme()
  return {
    bar: isDark ? '#818cf8' : '#5558e6',
    barDark: isDark ? '#6366f1' : '#4f46e5',
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
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
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

/* Compact horizontal bars — reusable for subject + topic accuracy */
function AccuracyBars({ data, labelKey, valueKey, delay = 0 }) {
  const reduce = useReducedMotion()
  const { isDark } = useTheme()
  const barColor = isDark ? '#818cf8' : '#5558e6'

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const name = item[labelKey] || item.name || item.topic
        const val = Math.max(0, Math.min(100, item[valueKey] || 0))
        return (
          <div key={name}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink truncate pr-3">{name}</span>
              <span className="tabular text-ink-2 whitespace-nowrap">{val}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-surface-2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                  boxShadow: val > 0 ? `0 0 10px ${barColor}30` : 'none',
                }}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AnalyticsPage() {
  const data = useAppData()
  const colors = useChartColors()
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
    <div className="space-y-8">
      <DemoBanner />
      <PageHeader
        eyebrow="Understand"
        title="Numbers that change what you study next."
        description="Charts read the same quiz results as Dashboard and Planner."
      />

      {!data.isDemo && !analytics.history?.length ? (
        <div className="mt-6">
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Charts fill in after the first attempt."
          />
        </div>
      ) : null}

      {/* ═══ STATS ═══ */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Overall accuracy" value={`${analytics.overallAccuracy ?? progress.quizAverage}%`} />
        <Stat label="Quizzes logged" value={String(analytics.history?.length || 0)} />
        <Stat label="Weak topics" value={String(progress.weakTopics?.length || 0)} />
      </div>

      {/* ═══ SUBJECT ACCURACY ═══ */}
      <ScrollReveal preset="fadeUp">
        <div className="card">
          <h3 className="text-sm font-semibold text-ink">Subject accuracy</h3>
          <p className="mt-1 text-xs text-ink-3">Which paper is the bottleneck?</p>
          <div className="mt-5">
            <AccuracyBars data={subjectBars} labelKey="name" valueKey="mastery" />
          </div>
        </div>
      </ScrollReveal>

      {/* ═══ TOPIC ACCURACY ═══ */}
      {topicBars?.length ? (
        <ScrollReveal preset="fadeUp" delay={0.05}>
          <div className="card">
            <h3 className="text-sm font-semibold text-ink">Topic accuracy</h3>
            <p className="mt-1 text-xs text-ink-3">Where is accuracy too low?</p>
            <div className="mt-5">
              <AccuracyBars data={topicBars} labelKey="topic" valueKey="accuracy" delay={0.1} />
            </div>
          </div>
        </ScrollReveal>
      ) : null}

      {/* ═══ IMPROVEMENT TREND ═══ */}
      {trend?.length ? (
        <ScrollReveal preset="fadeUp" delay={0.05}>
          <ChartCard title="Improvement trend" question="Are assessments improving after replans?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey={data.isDemo ? 'day' : 'attempt'} tick={{ fontSize: 11 }} stroke={colors.axis} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke={colors.axis} />
                <Tooltip content={<ThemeTooltip />} />
                <Line type="monotone" dataKey="accuracy" stroke={colors.line} strokeWidth={2} dot={false} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ScrollReveal>
      ) : null}

      {data.isDemo ? (
        <ScrollReveal preset="fadeUp" delay={0.05}>
          <ChartCard title="Overall mastery trend" question="Is readiness compounding, or stalling?">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={catalog.masteryTrend}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke={colors.axis} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke={colors.axis} />
                <Tooltip content={<ThemeTooltip />} />
                <Line type="monotone" dataKey="overall" stroke={colors.line} strokeWidth={2} name="Overall" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ScrollReveal>
      ) : null}

      {/* ═══ SUBJECT LISTS ═══ */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ScrollReveal preset="slideLeft">
          <section className="card">
            <h2 className="text-sm font-semibold text-ink">Weakest subjects</h2>
            <ul className="mt-3">
              {(analytics.weakest || []).map((t) => (
                <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                  <span>{t.name}</span>
                  <span className="tabular text-risk">{t.accuracy}%</span>
                </li>
              ))}
              {!(analytics.weakest || []).length && (
                <li className="py-3 text-sm text-ink-3">No data yet.</li>
              )}
            </ul>
          </section>
        </ScrollReveal>
        <ScrollReveal preset="slideRight" delay={0.05}>
          <section className="card">
            <h2 className="text-sm font-semibold text-ink">Strongest subjects</h2>
            <ul className="mt-3">
              {(analytics.strongest || []).map((t) => (
                <li key={t.name} className="flex justify-between border-t border-line py-3 text-sm">
                  <span>{t.name}</span>
                  <span className="tabular text-success">{t.accuracy}%</span>
                </li>
              ))}
              {!(analytics.strongest || []).length && (
                <li className="py-3 text-sm text-ink-3">No data yet.</li>
              )}
            </ul>
          </section>
        </ScrollReveal>
      </div>

      {/* ═══ QUIZ HISTORY ═══ */}
      <ScrollReveal>
        <section>
          <h2 className="text-sm font-semibold text-ink">Quiz history</h2>
          <ul className="mt-3 space-y-2">
            {(analytics.history || []).slice().reverse().map((q, i) => (
              <li key={`${q.at}-${i}`} className="card flex justify-between p-3 text-sm">
                <span>{q.subject} → {q.topic}</span>
                <span className="tabular">{q.score}%</span>
              </li>
            ))}
            {!(analytics.history || []).length && (
              <li className="py-3 text-sm text-ink-3">No quiz history yet.</li>
            )}
          </ul>
        </section>
      </ScrollReveal>

      {/* ═══ WEAK TOPICS + READINESS ═══ */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ScrollReveal preset="slideLeft">
          <section className="card">
            <h2 className="text-sm font-semibold text-ink">Weak topics</h2>
            <ul className="mt-3">
              {(progress.weakTopics || []).map((t) => (
                <li key={`${t.subject}-${t.name}`} className="flex justify-between border-t border-line py-3 text-sm">
                  <span>{t.subject} → {t.name}</span>
                  <span className="tabular text-risk">{t.mastery}%</span>
                </li>
              ))}
              {!(progress.weakTopics || []).length && (
                <li className="py-3 text-sm text-ink-3">No weak topics yet.</li>
              )}
            </ul>
          </section>
        </ScrollReveal>
        <ScrollReveal preset="slideRight" delay={0.05}>
          <section className="card">
            <h2 className="text-sm font-semibold text-ink">Preparation readiness</h2>
            <div className="mt-5 space-y-4">
              {readiness.map((r) => (
                <ProgressBar key={r.subjectId} value={r.overall} label={`${r.name} — ${r.statusLabel}`} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-[11px] uppercase tracking-wider text-ink-3">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular">{value}</p>
    </div>
  )
}
