import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CountUp } from '../components/ui/CountUp'
import { getQuizResultTemplate } from '../services/catalog'

const missMap = {
  q4: 'Lossless Decomposition',
  q6: 'Dependency Preservation',
}

export function QuizResultPage() {
  const template = getQuizResultTemplate()
  const result = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('eduvance.quiz.result') || 'null')
    } catch {
      return null
    }
  }, [])
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  if (!result) {
    return (
      <div>
        <PageHeader title="No quiz result yet" description="Start a quiz to generate a performance analysis." />
        <Button as={Link} to="/quiz">
          Go to quiz
        </Button>
      </div>
    )
  }

  const weakFromMiss = [...new Set((result.missed || []).map((id) => missMap[id]).filter(Boolean))]
  const weak = weakFromMiss.length ? weakFromMiss : template.weak
  const speed = Math.min(100, 55 + Math.round((result.leftover / 900) * 40))

  function addToPlan() {
    sessionStorage.setItem('eduvance.plan.inject', JSON.stringify({ topic: result.topic, from: 'quiz' }))
    setAdded(true)
    setTimeout(() => navigate('/planner'), 700)
  }

  return (
    <div>
      <PageHeader eyebrow="Quiz performance" title={`${result.subject} → ${result.topic}`} />
      <div className="border border-ink bg-ink px-8 py-10 text-canvas">
        <p className="text-[11px] uppercase tracking-wider text-canvas/50">Score</p>
        <p className="mt-2 font-serif tabular text-7xl">
          <CountUp to={result.score} suffix="%" duration={1100} />
        </p>
        <p className="mt-2 text-canvas/70">
          {result.correct} / {result.total} correct
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <ProgressBar value={template.concept} label="Concept mastery" />
        <ProgressBar value={speed} label="Speed" />
        <ProgressBar value={result.score} label="Accuracy" />
        <ProgressBar value={template.confidence} label="Confidence" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Strong areas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {template.strong.map((s) => (
              <li key={s}>✓ {s}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak areas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {weak.map((s) => (
              <li key={s}>⚠ {s}</li>
            ))}
          </ul>
        </section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 border-l-2 border-l-accent pl-4"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Eduvance recommendation</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink">{template.recommendation}</p>
        <Button className="mt-5" variant="accent" onClick={addToPlan} disabled={added}>
          {added ? 'Added to study plan' : 'Add to study plan'}
        </Button>
      </motion.section>
    </div>
  )
}
