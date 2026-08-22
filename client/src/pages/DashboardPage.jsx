import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Target, BookOpen, Zap, Calendar } from 'lucide-react'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ExamCard } from '../components/domain/ExamCard'
import { PlanCompare, RiskMonitor } from '../components/domain/PlanCompare'
import { ReadinessPanel } from '../components/domain/ReadinessPanel'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { DemoBanner } from '../components/domain/ModeBanners'
import { StudyRecommendation } from '../components/domain/StudyRecommendation'
import { ScrollReveal, StaggerChildren, StaggerItem } from '../components/ui/ScrollReveal'
import { StreakDisplay, StreakReminder } from '../components/ui/StreakDisplay'
import { useAppData } from '../hooks/useAppData'
import { useAppState } from '../context/AppState'

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
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
    <div className="space-y-16">
      <DemoBanner />

      {/* ═══════════════════════════════════════
          INTELLIGENCE HERO — Editorial layout with mascot
      ═══════════════════════════════════════ */}
      <ScrollReveal preset="blurIn" duration={0.6}>
        <div className="relative">
          {/* Ambient glow behind the hero text */}
          <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-[160px]"
            style={{ background: 'var(--color-accent-glow)' }} />

          {/* Streak */}
          <div className="mb-6">
            <StreakDisplay />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-2">
            ⚡ Adaptive preparation engine
          </p>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            What should you{' '}
            <span className="gradient-text">master</span>{' '}
            next?
          </h1>

          {now ? (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              {/* Left — recommendation */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm text-ink-3">→</span>
                  <p className="font-serif text-3xl text-ink sm:text-4xl">{now.subject}</p>
                </div>
                <p className="mt-1 ml-6 text-lg text-ink-2">{now.topic}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {now.minutes && (
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent-2)' }}>
                      <Clock size={13} />
                      {now.minutes} min
                    </span>
                  )}
                  {now.priority && (
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--color-high-bg)', color: 'var(--color-high)' }}>
                      <Zap size={13} />
                      Priority {now.priority}
                    </span>
                  )}
                  {data.exams?.[0] && (
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--color-med-bg)', color: 'var(--color-med)' }}>
                      <Calendar size={13} />
                      Exam soon
                    </span>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button as={Link} to="/study-session" size="lg">
                    Start study session
                    <ArrowRight size={16} />
                  </Button>
                  <Link to="/planner" className="text-sm font-medium text-ink-2 hover:text-accent-2 transition-colors">
                    View full plan →
                  </Link>
                </div>
              </div>

              {/* Right — score ring */}
              <div className="flex flex-col items-center gap-2">
                <ProgressRing value={student.prepScore} size={140} stroke={8} label="Ready" />
                <p className="text-[10px] uppercase tracking-wider text-ink-3">Preparation score</p>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-ink-2">Add exams in setup to get personalized recommendations.</p>
          )}
        </div>
      </ScrollReveal>

      {/* Streak reminder if today not studied */}
      <StreakReminder />

      {now && (
        <ScrollReveal preset="fadeUp" delay={0.1}>
          <StudyRecommendation item={now} />
        </ScrollReveal>
      )}

      {/* ═══ ADAPTIVE LOOP ═══ */}
      <ScrollReveal preset="scaleIn" delay={0.05}>
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">How Eduvance adapts</p>
          <div className="h-px flex-1" style={{ background: 'var(--color-line)' }} />
        </div>
        <div className="mt-4">
          <AdaptiveLoop compact />
        </div>
      </ScrollReveal>

      {data.monitorRisks?.length ? (
        <ScrollReveal>
          <RiskMonitor risks={data.monitorRisks} />
        </ScrollReveal>
      ) : null}

      {data.planDelta ? (
        <ScrollReveal>
          <PlanCompare delta={data.planDelta} />
        </ScrollReveal>
      ) : null}

      {/* ═══ TODAY'S SCHEDULE ═══ */}
      <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <ScrollReveal preset="slideLeft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Today's focus</p>
          {data.schedule?.length ? (
            <StaggerChildren className="mt-4 space-y-3" staggerDelay={0.04}>
              {data.schedule.map((block) => (
                <StaggerItem key={block.id}>
                  <div className="group flex items-center justify-between rounded-2xl p-4 transition-all duration-300 hover:translate-x-1" style={{
                    background: 'var(--color-card)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
                  }}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-bold text-accent-2" style={{ background: 'var(--color-accent-soft)' }}>
                        {block.subject?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{block.subject} → {block.topic}</p>
                        <p className="tabular text-xs text-ink-3">{block.start}–{block.end}</p>
                      </div>
                    </div>
                    <span className="tabular text-xs font-medium text-ink-2">{block.minutes}m</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <p className="mt-4 text-sm text-ink-2">No timed blocks until the planner engine runs.</p>
          )}
          <Link to="/planner" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 hover:text-accent transition-colors">
            Open planner <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        <ScrollReveal preset="slideRight" delay={0.1}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Overall preparation</p>
          <div className="mt-6 flex justify-center">
            <ProgressRing value={student.prepScore} size={180} stroke={10} label="Ready" />
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ KEY METRICS ═══ */}
      <StaggerChildren className="grid gap-5 sm:grid-cols-3" staggerDelay={0.08}>
        <StaggerItem>
          <MetricCard emoji="⏱" label="Study hours" value={`${progress.hoursThisWeek}`} unit="h" hint={`target ${progress.hoursTarget}h`} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard emoji="📚" label="Topics captured" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} hint="from syllabus" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard emoji="🎯" label="Quiz average" value={`${progress.quizAverage}`} unit="%" hint="across all quizzes" />
        </StaggerItem>
      </StaggerChildren>

      {data.readiness?.length ? (
        <ScrollReveal>
          <ReadinessPanel items={data.readiness} />
        </ScrollReveal>
      ) : null}

      {/* ═══ EXAMS + SYLLABUS ═══ */}
      <div className="grid gap-12 lg:grid-cols-2">
        <ScrollReveal preset="slideLeft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Upcoming exams</p>
          <div className="mt-4 space-y-3">
            {data.exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal preset="slideRight" delay={0.08}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Syllabus completion</p>
          <div className="mt-4 space-y-5">
            {data.subjects.map((s) => (
              <ProgressBar key={s.id} value={s.progress} label={s.name} />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ WEAK TOPICS ═══ */}
      {progress.weakTopics?.length ? (
        <ScrollReveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Topics needing attention</p>
          <StaggerChildren className="mt-4 space-y-2" staggerDelay={0.04}>
            {progress.weakTopics.map((t) => (
              <StaggerItem key={t.name}>
                <div className="group flex items-center justify-between rounded-2xl p-4 transition-all duration-300 hover:translate-x-1" style={{
                  background: 'var(--color-card)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <span className="text-sm text-ink">{t.subject} → {t.name}</span>
                  <span className="tabular text-sm font-medium text-risk">{t.mastery}%</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </ScrollReveal>
      ) : null}
    </div>
  )
}

function MetricCard({ emoji, label, value, unit = '', hint }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl p-5"
      style={{
        background: 'var(--color-card)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03), 0 0 40px var(--color-glow)',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</p>
          <p className="mt-2 tabular text-3xl font-semibold text-ink">
            {value}<span className="text-lg text-ink-2">{unit}</span>
          </p>
          {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
        </div>
        <motion.span
          className="text-2xl"
          whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {emoji}
        </motion.span>
      </div>
    </motion.div>
  )
}
