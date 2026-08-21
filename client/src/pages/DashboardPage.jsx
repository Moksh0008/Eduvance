import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Target, BookOpen, Zap, Calendar, TrendingUp } from 'lucide-react'
import { CountUp } from '../components/ui/CountUp'
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
import { ScrollReveal, StaggerChildren, StaggerItem } from '../components/ui/ScrollReveal'
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
  const greeting = getTimeGreeting()

  return (
    <div className="space-y-12">
      <DemoBanner />

      {/* ═══ INTELLIGENCE HERO ═══ */}
      <ScrollReveal preset="fadeUp" duration={0.5}>
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{
          background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-card))',
          border: '1px solid var(--color-card-border)',
          boxShadow: '0 0 80px var(--color-glow), 0 20px 60px rgba(0,0,0,0.08)',
        }}>
          {/* Ambient glow inside hero */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-[80px]"
            style={{ background: 'var(--color-accent-glow)' }} />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-[60px]"
            style={{ background: 'var(--color-glow)' }} />

          <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-2">
            {greeting}, {student.name}
          </p>
          <h1 className="relative mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            Your next move
            <span className="gradient-text"> is ready.</span>
          </h1>

          {now ? (
            <div className="relative mt-6 flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-ink-2">The engine recommends</p>
                <p className="mt-1 font-serif text-2xl text-ink sm:text-3xl">{now.subject}</p>
                <p className="mt-0.5 text-sm text-ink-3">{now.topic}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-3">
                  {now.minutes && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'var(--color-accent-soft)' }}>
                      <Clock size={12} className="text-accent-2" />
                      {now.minutes} min
                    </span>
                  )}
                  {now.priority && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'var(--color-high-bg)' }}>
                      <Zap size={12} className="text-high" />
                      Priority {now.priority}
                    </span>
                  )}
                  {data.exams?.[0] && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'var(--color-med-bg)' }}>
                      <Calendar size={12} className="text-med" />
                      Exam soon
                    </span>
                  )}
                </div>
                <Button className="mt-5" size="lg" as={Link} to="/study-session">
                  Start study session
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
              <div className="hidden sm:block">
                <ProgressRing value={student.prepScore} size={120} stroke={7} label="Ready" />
              </div>
            </div>
          ) : (
            <p className="relative mt-4 text-sm text-ink-2">Add exams in setup to get personalized recommendations.</p>
          )}
        </div>
      </ScrollReveal>

      {now && (
        <ScrollReveal preset="fadeUp" delay={0.1}>
          <StudyRecommendation item={now} />
        </ScrollReveal>
      )}

      {/* ═══ ADAPTIVE LOOP ═══ */}
      <ScrollReveal preset="scaleIn" delay={0.05}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">How Eduvance adapts</p>
        <div className="mt-3">
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

      {/* ═══ TODAY'S SCHEDULE + PREPARATION ═══ */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <ScrollReveal preset="slideLeft">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Today's focus</h2>
          {data.schedule?.length ? (
            <StaggerChildren className="mt-4 space-y-2" staggerDelay={0.04}>
              {data.schedule.map((block) => (
                <StaggerItem key={block.id}>
                  <div className="group flex items-center justify-between rounded-xl p-3 transition-all duration-200 hover:translate-x-1" style={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-card-border)',
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold text-accent-2" style={{ background: 'var(--color-accent-soft)' }}>
                        {block.subject?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{block.subject} → {block.topic}</p>
                        <p className="tabular text-xs text-ink-3">{block.start}–{block.end}</p>
                      </div>
                    </div>
                    <span className="tabular text-xs text-ink-2">{block.minutes} min</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <p className="mt-4 text-sm text-ink-2">No timed blocks until the planner engine runs on your subjects.</p>
          )}
          <Link to="/planner" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 hover:text-accent transition-colors">
            Open planner <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        <ScrollReveal preset="slideRight" delay={0.1}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Overall preparation</h2>
          <div className="mt-4 flex justify-center">
            <ProgressRing value={student.prepScore} size={160} stroke={9} label="Ready" />
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ KEY METRICS ═══ */}
      <StaggerChildren className="grid gap-4 sm:grid-cols-3" staggerDelay={0.08}>
        <StaggerItem>
          <MetricCard icon={Clock} label="Study hours this week" value={`${progress.hoursThisWeek}`} unit="h" hint={`target ${progress.hoursTarget}h`} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard icon={BookOpen} label="Topics captured" value={`${progress.topicsCompleted}/${progress.topicsTotal}`} hint="from syllabus" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard icon={Target} label="Quiz average" value={`${progress.quizAverage}`} unit="%" hint="across all quizzes" />
        </StaggerItem>
      </StaggerChildren>

      {data.readiness?.length ? (
        <ScrollReveal>
          <ReadinessPanel items={data.readiness} />
        </ScrollReveal>
      ) : null}

      {/* ═══ EXAMS + SYLLABUS ═══ */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ScrollReveal preset="slideLeft">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Upcoming exams</h2>
          <div className="mt-3 space-y-3">
            {data.exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal preset="slideRight" delay={0.08}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Syllabus completion</h2>
          <div className="mt-3 space-y-4">
            {data.subjects.map((s) => (
              <ProgressBar key={s.id} value={s.progress} label={s.name} />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ WEAK TOPICS ═══ */}
      {progress.weakTopics?.length ? (
        <ScrollReveal>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Topics needing attention</h2>
          <StaggerChildren className="mt-3 space-y-2" staggerDelay={0.04}>
            {progress.weakTopics.map((t) => (
              <StaggerItem key={t.name}>
                <div className="flex items-center justify-between rounded-xl p-3 transition-all duration-200 hover:translate-x-1" style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-card-border)',
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

function MetricCard({ icon: Icon, label, value, unit = '', hint }) {
  return (
    <div className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5" style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-card-border)',
      boxShadow: '0 2px 12px var(--color-glow)',
    }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</p>
          <p className="mt-2 tabular text-3xl font-semibold text-ink">
            {value}<span className="text-lg text-ink-2">{unit}</span>
          </p>
          {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
        </div>
        <div className="rounded-lg p-2 transition-transform duration-200 group-hover:scale-110" style={{ background: 'var(--color-accent-soft)' }}>
          <Icon size={18} className="text-accent-2" />
        </div>
      </div>
      {/* Subtle accent line at bottom */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
    </div>
  )
}
