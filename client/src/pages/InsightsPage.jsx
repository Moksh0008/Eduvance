import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { getGaps } from '../services/catalog'

export function InsightsPage() {
  const gaps = getGaps()
  return (
    <div>
      <PageHeader
        eyebrow="Understand"
        title="Where are you losing marks?"
        description="Gaps are not overall percentages. They split concept, problem-solving, and recall so the next 35 minutes have a job."
      />
      <div className="space-y-10">
        {gaps.map((g, i) => (
          <motion.article
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="border-t border-line pt-6"
          >
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              {g.subject} · {g.category}
            </p>
            <h2 className="mt-1 font-serif text-3xl text-ink">{g.topic}</h2>
            <div className="mt-5 max-w-xl space-y-3">
              <ProgressBar value={g.concept} label="Concept understanding" />
              <ProgressBar value={g.problemSolving} label="Problem solving" />
              <ProgressBar value={g.recall} label="Recall" />
              <ProgressBar value={g.mastery} label="Overall mastery" barClassName="bg-ink" />
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
