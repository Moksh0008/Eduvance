import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Target, BookOpen, Zap, AlertTriangle } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PriorityCard } from '../components/domain/PriorityCard'
import { ExamCard } from '../components/domain/ExamCard'
import { PlanCompare, RiskMonitor } from '../components/domain/PlanCompare'
import { ReadinessPanel } from '../components/domain/ReadinessPanel'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { DemoBanner } from '../components/domain/ModeBanners'
import { StudyRecommendation } from '../components/domain/StudyRecommendation'
import { useAppData } from '../hooks/useAppData'
import { useAppState } from '../context/AppState'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function DashboardPage() {
  const data = useAppData()
  const { setupCompleted } = useAppState()

  if (!setupCompleted && !data.isDemo) {
    return (
      <EmptyState
        title="Complete setup to begin adaptive preparation."
        body="Eduvance needs your timetable, syllabus, and available hours before it can recommend what to study."
        action={
          <Button as={Link} to="/setup">
            Continue setup
          </Button>
        }
      />
    )
  }

  const student = data.student
  const now = data.nowStudy
  const progress = data.progress

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <DemoBanner />

      <PageHeader
        eyebrow="Overview"
        title={`Good morning, ${student.name}.`}
        description="What to study now, from the same preparation used by Quiz, Planner, and Analytics."
      />

      {now ? (
        <motion.div variants={fadeUp}>
          <PriorityCard item={now} />
          <StudyRecommendation item={now} />
        </motion.div>
      ) : (
        <EmptyState title="No subjects yet" body="Add exams in setup to rank today's work." />
      )}

      <motion.div variants={fadeUp} className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Adaptive loop</p>
        <div className="mt-3">
          <AdaptiveLoop compact />
        </div>
      </motion.div>

      {data.monitorRisks?.length ? (
        <motion.div variants={fadeUp} className="mt-8">
          <RiskMonitor risks={data.monitorRisks} />
        </motion.div>
      ) : null}

      {data.planDelta ? (
        <motion.div variants={fadeUp} className="mt-8">
          <PlanCompare delta={data.planDelta} />
        </motion.div>
      ) : (
        <motion.section variants={fadeUp} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Current study plan</h2>
          <p className="mt-2 text-sm text-ink-2">
            {data.generate === 'quizzes'
              ? 'You asked for quizzes only. A calendar will appear if you add timetable generation in setup.'
              : 'The timetable is queued. Quiz evidence will reallocate minutes after the engine is connected.'}
          </p>
        </motion.section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today's allocated blocks</h2>
          {data.schedule?.length ? (
            <ul className="mt-4">
              {data.schedule.map((block, i) => (
                <motion.li
                  key={block.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card mb-2 flex flex-wrap items-baseline justify-between gap-2 p-3"
                >
                  <div>
                    <p className="tabular text-xs text-ink-3">
                      {block.start}–{block.end}
                    </p>
                    <p className="font-medium text-ink">
                      {block.subject} → {block.topic}
                    </p>
                  </div>
                  <p className="text-sm text-ink-2">{block.minutes} min</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-2">No timed blocks until the planner engine runs on your subjects.</p>
          )}
          <Link to="/planner" className="mt-4 inline-block text-sm font-medium text-accent-2 hover:text-accent transition-colors">
            Open planner →
          </Link>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Overall preparation</h2>
          <div className="mt-4">
            <ProgressRing value={student.prepScore} size={140} stroke={8} label="Ready" />
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Study hours this week" value={`${progress.hoursThisWeek}h`} hint={`target ${progress.hoursTarget}h`} icon={Clock} />
        <StatCard label="Topics captured" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} icon={BookOpen} />
        <StatCard label="Quiz average" value={`${progress.quizAverage}%`} icon={Target} />
      </motion.div>

      {data.readiness?.length ? (
        <motion.div variants={fadeUp} className="mt-8">
          <ReadinessPanel items={data.readiness} />
        </motion.div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <motion.section variants={fadeUp}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Upcoming exams</h2>
          <div className="mt-2">
            {data.exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </motion.section>
        <motion.section variants={fadeUp}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Syllabus completion</h2>
          <div className="mt-4 space-y-4">
            {data.subjects.map((s) => (
              <ProgressBar key={s.id} value={s.progress} label={s.name} />
            ))}
          </div>
        </motion.section>
      </div>

      {progress.weakTopics?.length ? (
        <motion.section variants={fadeUp} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Weak topics</h2>
          <ul className="mt-3">
            {progress.weakTopics.map((t) => (
              <li key={t.name} className="card mb-2 flex justify-between p-3 text-sm">
                <span>
                  {t.subject} → {t.name}
                </span>
                <span className="tabular text-risk">{t.mastery}%</span>
              </li>
            ))}
          </ul>
        </motion.section>
      ) : null}
    </motion.div>
  )
}
