import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { PriorityCard } from '../components/domain/PriorityCard'
import { ExamCard } from '../components/domain/ExamCard'
import { RiskAlert } from '../components/domain/RiskAlert'
import { getStudent, getNowStudy, getExams, getSubjects, getProgress, getSchedule } from '../services/catalog'

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
        eyebrow="Dashboard"
        title={`Good evening, ${student.name}.`}
        description="The next block is chosen from deadline pressure, weightage, paper frequency, and mastery — not from a static timetable."
      />

      <PriorityCard item={now} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today’s study plan</h2>
          <ul className="mt-4">
            {today.map((block) => (
              <li key={block.id} className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line py-3">
                <div>
                  <p className="tabular text-xs text-ink-3">
                    {block.start}–{block.end}
                  </p>
                  <p className="font-medium text-ink">
                    {block.subject} → {block.topic}
                  </p>
                </div>
                <p className="text-sm text-ink-2">{block.minutes} min</p>
              </li>
            ))}
          </ul>
          <Link to="/planner" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Open full planner →
          </Link>
        </div>

        <div className="flex flex-col items-start">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Overall preparation</h2>
          <div className="mt-4">
            <ProgressRing value={student.prepScore} size={120} stroke={8} label="Ready" />
          </div>
          <p className="mt-3 text-sm text-ink-2">Target {student.targetPrepScore}% before the last paper.</p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <StatCard label="Study hours this week" value={`${progress.hoursThisWeek}h`} hint={`of ${progress.hoursTarget}h planned`} />
        <StatCard label="Topics completed" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} />
        <StatCard label="Quiz average" value={`${progress.quizAverage}%`} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
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

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Risk alerts</h2>
          <div className="mt-4 space-y-4">
            {progress.risks.map((risk) => (
              <RiskAlert key={risk.id} risk={risk} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Recent activity</h2>
          <ul className="mt-2">
            {progress.activity.map((item) => (
              <li key={item.id} className="border-t border-line py-3">
                <p className="text-sm text-ink">{item.text}</p>
                <p className="text-xs text-ink-3">{item.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
