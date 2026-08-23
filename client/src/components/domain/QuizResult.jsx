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

      {/* Answer Review */}
      {result.questionDetails && result.questionDetails.length > 0 && (
        <motion.div custom={2} variants={reveal} initial={reduce ? false : 'hidden'} animate="show" className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3 mb-4">Answer Review</h2>
          <div className="space-y-4">
            {result.questionDetails.map((q, i) => (
              <div key={i} className={`rounded-lg border p-4 ${q.correct ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${q.correct ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    {q.correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{i + 1}. {q.prompt}</p>
                    {q.options && (
                      <div className="mt-2 space-y-1">
                        {q.options.map((opt, oi) => (
                          <p key={oi} className={`text-sm ${oi === q.correctAnswer ? 'font-semibold text-success' : oi === q.userAnswer && !q.correct ? 'text-danger' : 'text-ink-2'}`}>
                            {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctAnswer ? '✓' : ''} {oi === q.userAnswer && !q.correct ? '(your answer)' : ''}
                          </p>
                        ))}
                      </div>
                    )}
                    {!q.correct && q.explanation && (
                      <p className="mt-2 text-sm text-accent-2 bg-accent/10 rounded px-3 py-2">💡 {q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
