import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { PriorityCard } from '../components/domain/PriorityCard'
import { ExamCard } from '../components/domain/ExamCard'
import { PlanCompare, RiskMonitor } from '../components/domain/PlanCompare'
import { ReadinessPanel } from '../components/domain/ReadinessPanel'
import {
  getStudent,
  getNowStudy,
  getExams,
  getSubjects,
  getProgress,
  getSchedule,
  getPlanDelta,
  getMonitorRisks,
  getReadiness,
} from '../services/catalog'

export function DashboardPage() {
  const student = getStudent()
  const now = getNowStudy()
  const exams = getExams()
  const subjects = getSubjects()
  const progress = getProgress()
  const today = getSchedule(false)

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Good morning, ${student.name}.`}
        description="Here's what Eduvance thinks you should focus on today."
      />

      <PriorityCard item={now} />

      <div className="mt-14">
        <RiskMonitor risks={getMonitorRisks()} />
      </div>

      <div className="mt-14">
        <PlanCompare delta={getPlanDelta()} />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today’s allocated blocks</h2>
          <ul className="mt-4">
            {today.map((block, i) => (
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
          <Link to="/planner" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Open full planner →
          </Link>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Overall preparation</h2>
          <div className="mt-4">
            <ProgressRing value={student.prepScore} size={120} stroke={8} label="Ready" />
          </div>
          <p className="mt-3 text-sm text-ink-2">Target {student.targetPrepScore}% readiness — not a predicted mark.</p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <StatCard label="Study hours this week" value={`${progress.hoursThisWeek}h`} hint={`of ${progress.hoursTarget}h planned`} />
        <StatCard label="Topics completed" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} />
        <StatCard label="Quiz average" value={`${progress.quizAverage}%`} />
      </div>

      <div className="mt-14">
        <ReadinessPanel items={getReadiness()} />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Upcoming exams</h2>
          <div className="mt-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Subject progress</h2>
          <div className="mt-4 space-y-4">
            {subjects.map((s) => (
              <ProgressBar key={s.id} value={s.progress} label={s.name} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
