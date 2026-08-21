import { motion, useReducedMotion } from 'framer-motion'
import { CountUp } from '../ui/CountUp'
import { ProgressBar } from '../ui/ProgressBar'
import { AdaptiveLoop } from './AdaptiveLoop'
import { AdaptiveInsight } from './AdaptiveInsight'
import { reveal } from '../../animations/variants'

export function QuizResult({ result, onAddToPlan, added }) {
  const reduce = useReducedMotion()
  const weak = result.score < 70 ? [result.topic] : []
  const strong = result.score >= 70 ? [result.topic] : []

  return (
    <div>
      <motion.div
        custom={0}
        variants={reveal}
        initial={reduce ? false : 'hidden'}
        animate="show"
        className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.12] via-surface to-surface px-8 py-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/[0.08] blur-[80px]" />
        <p className="relative text-[11px] uppercase tracking-wider text-accent-2">Score</p>
        <p className="relative mt-2 font-serif tabular text-7xl gradient-text">
          <CountUp to={result.score} suffix="%" duration={1100} />
        </p>
        <p className="relative mt-2 text-ink-2">
          {result.correct} / {result.total} {result.kind === 'check' ? 'confident answers' : 'correct'}
        </p>
      </motion.div>

      <motion.div custom={1} variants={reveal} initial={reduce ? false : 'hidden'} animate="show" className="mt-10 grid gap-5 sm:grid-cols-2">
        <ProgressBar value={result.score} label="Accuracy" />
        <ProgressBar value={result.score} label="This attempt" />
      </motion.div>

      <motion.div custom={2} variants={reveal} initial={reduce ? false : 'hidden'} animate="show" className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Topic analysis</h2>
          <p className="mt-3 text-sm text-ink-2">
            {result.subject} → {result.topic}. Saved to your preparation state so Analytics, Planner, and Dashboard update together.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak areas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(weak.length ? weak : ['None flagged this attempt']).map((s) => (
              <li key={s} className="text-high">⚠ {s}</li>
            ))}
          </ul>
          {strong.length ? <p className="mt-4 text-sm text-success">Held: {strong.join(', ')}</p> : null}
        </section>
      </motion.div>

      <motion.div custom={3} variants={reveal} initial={reduce ? false : 'hidden'} animate="show" className="mt-10">
        <AdaptiveLoop compact />
      </motion.div>

      <motion.div custom={4} variants={reveal} initial={reduce ? false : 'hidden'} animate="show" className="mt-12">
        <AdaptiveInsight title="Recommendation">
          {result.score < 70
            ? `Return to ${result.topic} before moving on. Remaining study minutes should increase on the next plan.`
            : `${result.topic} can yield minutes to weaker remaining topics.`}
        </AdaptiveInsight>
        {onAddToPlan ? (
          <button
            type="button"
            onClick={onAddToPlan}
            disabled={added}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white transition-all hover:bg-accent-2 disabled:opacity-50"
            data-cursor="click"
          >
            {added ? 'Fed into planner' : 'Open updated planner'}
          </button>
        ) : null}
      </motion.div>
    </div>
  )
}
