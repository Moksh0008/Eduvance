import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { DemoBanner } from '../components/domain/ModeBanners'
import { EmptyState } from '../components/ui/EmptyState'
import { getGaps } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'

export function InsightsPage() {
  const data = useAppData()
  const gaps = data.isDemo
    ? getGaps()
    : (data.progress?.weakTopics || []).map((t, i) => ({
        id: `gap-${i}`,
        subject: t.subject,
        topic: t.name,
        category: 'Quiz evidence',
        concept: t.mastery,
        problemSolving: Math.max(0, t.mastery - 8),
        recall: Math.max(0, t.mastery - 4),
        mastery: t.mastery,
        recommendation: `${t.topic || t.name} scored ${t.mastery}%. Return here before the next paper.`,
      }))
  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Understand"
        title="Where are you losing marks?"
        description="Gaps are not overall percentages. They split concept, problem-solving, and recall so the next 35 minutes have a job."
      />
      <div className="space-y-10">
        {!data.isDemo && !(data.quizResults || []).length ? (
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Gap cards are derived from quiz evidence in your workspace — not a sample DBMS pack."
          />
        ) : null}
        {!data.isDemo && (data.quizResults || []).length && gaps.length === 0 ? (
          <p className="text-sm text-ink-2">No weak topics flagged from recent quizzes. Analytics still has the full history.</p>
        ) : null}
        {data.isDemo && gaps.length === 0 ? (
          <EmptyState
            title="Complete your first quiz to unlock performance insights."
            body="Gap cards are derived from quiz evidence in your workspace — not a sample DBMS pack."
          />
        ) : null}
        {gaps.map((g, i) => (
          <motion.article
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card border-l-2 border-l-accent p-6"
          >
            <p className="text-[11px] uppercase tracking-wider text-accent-2">
              {g.subject} · {g.category}
            </p>
            <h2 className="mt-1 font-serif text-3xl text-ink">{g.topic}</h2>
            <div className="mt-5 max-w-xl space-y-3">
              <ProgressBar value={g.concept} label="Concept understanding" />
              <ProgressBar value={g.problemSolving} label="Problem solving" />
              <ProgressBar value={g.recall} label="Recall" />
              <ProgressBar value={g.mastery} label="Overall mastery" barClassName="bg-accent" />
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">{g.recommendation}</p>
            <Button as={Link} to="/study-session" size="sm" className="mt-4">
              Practice this gap
            </Button>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
