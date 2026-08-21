import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <div>
      <DemoBanner />

      <PageHeader
        eyebrow="Overview"
        title={`Good morning, ${student.name}.`}
        description="What to study now, from the same preparation used by Quiz, Planner, and Analytics."
      />

      {now ? (
        <>
          <PriorityCard item={now} />
          <StudyRecommendation item={now} />
        </>
      ) : (
        <EmptyState title="No subjects yet" body="Add exams in setup to rank today’s work." />
      )}

      <div className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Adaptive loop</p>
        <div className="mt-3">
          <AdaptiveLoop compact />
        </div>
      </div>

      {data.monitorRisks?.length ? (
        <div className="mt-14">
          <RiskMonitor risks={data.monitorRisks} />
        </div>
      ) : null}

      {data.planDelta ? (
        <div className="mt-14">
          <PlanCompare delta={data.planDelta} />
        </div>
      ) : (
        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Current study plan</h2>
          <p className="mt-2 text-sm text-ink-2">
            {data.generate === 'quizzes'
              ? 'You asked for quizzes only. A calendar will appear if you add timetable generation in setup.'
              : 'The timetable is queued. Quiz evidence will reallocate minutes after the engine is connected.'}
          </p>
        </section>
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today’s allocated blocks</h2>
          {data.schedule?.length ? (
            <ul className="mt-4">
              {data.schedule.map((block, i) => (
                <motion.li
                  key={block.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line py-3"
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
          <Link to="/planner" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Open planner →
          </Link>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Overall preparation</h2>
          <div className="mt-4">
            <ProgressRing value={student.prepScore} size={120} stroke={8} label="Ready" />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <StatCard label="Study hours this week" value={`${progress.hoursThisWeek}h`} hint={`target ${progress.hoursTarget}h`} />
        <StatCard label="Topics captured" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} />
        <StatCard label="Quiz average" value={`${progress.quizAverage}%`} />
      </div>

      {data.readiness?.length ? (
        <div className="mt-14">
          <ReadinessPanel items={data.readiness} />
        </div>
      ) : null}

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Upcoming exams</h2>
          <div className="mt-2">
            {data.exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Syllabus completion</h2>
          <div className="mt-4 space-y-4">
            {data.subjects.map((s) => (
              <ProgressBar key={s.id} value={s.progress} label={s.name} />
            ))}
          </div>
        </section>
      </div>

      {progress.weakTopics?.length ? (
        <section className="mt-14">
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
      ) : null}
    </div>
  )
}
