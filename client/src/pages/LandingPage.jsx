import { motion } from 'framer-motion'
import { MarketingNav } from '../components/layout/MarketingNav'
import { StartPreparingButton } from '../components/auth/StartPreparingButton'
import { useTheme } from '../context/ThemeContext'
import { ScrollReveal, StaggerChildren, StaggerItem } from '../components/ui/ScrollReveal'

const features = [
  { emoji: '⚡', text: 'Priority engine' },
  { emoji: '🔄', text: 'Auto-replan' },
  { emoji: '📊', text: 'Quiz analytics' },
  { emoji: '🗓', text: 'Smart planner' },
  { emoji: '🎯', text: 'Focus sessions' },
]

/* ═══ Cinematic story steps ═══ */
const storySteps = [
  { emoji: '📚', title: 'Too much to study', desc: 'Your syllabus feels endless. Every subject demands attention.', color: '#ef4444' },
  { emoji: '⏳', title: 'Too little time', desc: 'The exam date creeps closer. Panic sets in.', color: '#f97316' },
  { emoji: '🔍', title: 'Eduvance analyzes', desc: 'The engine reads your syllabus, exam dates, and past performance.', color: '#6366f1' },
  { emoji: '⚡', title: 'Priorities form', desc: 'Weak topics rise. Mastered topics step back.', color: '#8b5cf6' },
  { emoji: '🗓', title: 'Your plan appears', desc: 'A personalized schedule that adapts to your reality.', color: '#06b6d4' },
  { emoji: '📖', title: 'You study', desc: 'Focused sessions on exactly what matters most.', color: '#10b981' },
  { emoji: '🎯', title: 'You take a quiz', desc: 'Test what you learned. Get instant feedback.', color: '#ec4899' },
  { emoji: '🔄', title: 'The plan adapts', desc: 'Weaknesses detected. Strategy replanned. You keep improving.', color: '#eab308' },
]

const capabilities = [
  { emoji: '🧠', title: 'Adaptive Engine', desc: 'Continuously learns from your performance and adjusts priorities in real-time.' },
  { emoji: '📅', title: 'Smart Planner', desc: 'Builds a study schedule around your exam dates, available hours, and topic difficulty.' },
  { emoji: '🎯', title: 'Intelligent Quizzes', desc: 'Tests targeting your weak areas. Every question has a purpose.' },
  { emoji: '📈', title: 'Live Analytics', desc: 'Visualize your progress, mastery levels, and improvement trends.' },
  { emoji: '🔄', title: 'Auto-Replan', desc: 'When you struggle with a topic, the plan automatically shifts focus.' },
  { emoji: '💡', title: 'Contextual Insights', desc: 'AI-powered observations about your preparation patterns.' },
]

export function LandingPage() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      {/* Fixed background image */}
      <div className="fixed inset-0 z-0">
        <img
          src={isDark ? '/dark-theme-bg.png' : '/light-theme-bg.png'}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ opacity: 0.5 }}
        />
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(6,9,24,0.15) 0%, rgba(6,9,24,0.5) 40%, rgba(6,9,24,0.85) 70%, var(--color-canvas) 100%)'
            : 'linear-gradient(180deg, rgba(244,242,238,0.05) 0%, rgba(244,242,238,0.35) 40%, rgba(244,242,238,0.75) 70%, var(--color-canvas) 100%)'
        }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <MarketingNav />

        <main>
          {/* ═══ HERO ═══ */}
          <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center sm:pt-32 sm:pb-24">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} className="relative z-10 flex flex-col items-center">

              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-4 max-w-xl font-serif text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
                Stop guessing<br /><span className="gradient-text">what to study.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-4 max-w-md text-sm text-ink-2 sm:text-base">
                Eduvance decides what, when, and how long — then replans when your performance changes.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8">
                <StartPreparingButton size="lg" continueLabel="Get Started" />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-2">
                {features.map((f) => (
                  <motion.span key={f.text} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-2"
                    style={{ background: 'rgba(10,14,40,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span>{f.emoji}</span>{f.text}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ═══ CINEMATIC STORY — See Eduvance in Action ═══ */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-10">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-2">
                  See Eduvance in action
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
                  From confusion to <span className="gradient-text">clarity</span>
                </h2>
                <p className="mt-3 text-sm text-ink-2 sm:text-base">
                  Every student's journey follows the same pattern. Eduvance accelerates every step.
                </p>
              </div>
            </ScrollReveal>

            {/* Story timeline */}
            <div className="relative mx-auto mt-16 max-w-3xl">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px sm:left-1/2 sm:-translate-x-px"
                style={{ background: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(26,29,46,0.08)' }} />

              {storySteps.map((step, i) => {
                const isLeft = i % 2 === 0
                return (
                  <ScrollReveal key={step.title} preset={isLeft ? 'slideLeft' : 'slideRight'} delay={i * 0.05}>
                    <div className={`relative mb-12 flex items-start gap-4 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-4 -translate-x-1/2 sm:left-1/2 z-10">
                        <motion.div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                          style={{
                            background: `${step.color}18`,
                            border: `2px solid ${step.color}40`,
                            boxShadow: `0 0 20px ${step.color}15`,
                          }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {step.emoji}
                        </motion.div>
                      </div>

                      {/* Content card */}
                      <div className={`ml-14 sm:ml-0 sm:w-[calc(50%-2.5rem)] ${isLeft ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                        <div className="rounded-2xl p-4 sm:p-5"
                          style={{
                            background: isDark ? 'rgba(17,22,49,0.5)' : 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${isDark ? 'rgba(148,163,184,0.06)' : 'rgba(26,29,46,0.04)'}`,
                          }}
                        >
                          <h3 className="font-serif text-lg font-medium" style={{ color: step.color }}>
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm text-ink-2">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </section>

          {/* ═══ CAPABILITIES ═══ */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-10">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-2">
                  What Eduvance does
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
                  Intelligence that <span className="gradient-text">adapts</span>
                </h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {capabilities.map((cap) => (
                <StaggerItem key={cap.title}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="rounded-2xl p-5 transition-all duration-300"
                    style={{
                      background: isDark ? 'rgba(17,22,49,0.5)' : 'rgba(255,255,255,0.55)',
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${isDark ? 'rgba(148,163,184,0.06)' : 'rgba(26,29,46,0.04)'}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
                    }}
                  >
                    <span className="text-2xl">{cap.emoji}</span>
                    <h3 className="mt-3 font-serif text-lg font-medium text-ink">{cap.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">{cap.desc}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>

          {/* ═══ FINAL CTA ═══ */}
          <section className="relative px-4 py-20 text-center sm:px-6">
            <ScrollReveal preset="scaleIn">
              <div className="mx-auto max-w-xl">
                <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                  Your preparation deserves <span className="gradient-text">intelligence</span>
                </h2>
                <p className="mt-4 text-sm text-ink-2 sm:text-base">
                  Stop guessing. Start preparing with a system that adapts to you.
                </p>
                <div className="mt-8">
                  <StartPreparingButton size="lg" continueLabel="Start Preparing" />
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <footer className="py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-ink-3 sm:flex-row sm:justify-between sm:px-6">
            <p>🎓 Eduvance — Education + Advance</p>
            <p>Adaptive examination preparation</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
