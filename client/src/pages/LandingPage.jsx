import { motion } from 'framer-motion'
import { MarketingNav } from '../components/layout/MarketingNav'
import { StartPreparingButton } from '../components/auth/StartPreparingButton'
import { useTheme } from '../context/ThemeContext'
import { ScrollReveal } from '../components/ui/ScrollReveal'

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

          {/* ═══ VIDEO DEMO ═══ */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-10">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-2">
                  See it in action
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">\                  Meet <span className="gradient-text">Octo</span>, your study companion
                </h2>
                <p className="mt-3 text-sm text-ink-2 sm:text-base">\                  Watch how Eduvance analyzes your syllabus, builds a smart plan, and adapts as you learn.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal preset="scaleIn" delay={0.15}>
              <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl"
                style={{
                  background: isDark ? 'rgba(17,22,49,0.6)' : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(26,29,46,0.06)'}`,
                  boxShadow: isDark
                    ? '0 8px 40px rgba(99,102,241,0.12), 0 0 80px rgba(99,102,241,0.05)'
                    : '0 8px 40px rgba(0,0,0,0.08)',
                }}>
                {/* Video player container */}
                <div className="relative aspect-video w-full overflow-hidden" style={{
                  background: isDark
                    ? 'linear-gradient(135deg, #0f1629 0%, #1a1040 50%, #0d1f3c 100%)'
                    : 'linear-gradient(135deg, #f8f7ff 0%, #eef1ff 50%, #f0f4ff 100%)',
                }}>
                  {/* Simulated Eduvance UI inside video */}
                  <div className="absolute inset-0 flex">
                    {/* Mini sidebar */}
                    <div className="hidden w-[18%] flex-col gap-2 p-3 sm:flex" style={{
                      background: isDark ? 'rgba(10,14,40,0.6)' : 'rgba(255,255,255,0.8)',
                      borderRight: `1px solid ${isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.04)'}`,
                    }}>
                      <div className="mb-2 flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md text-[8px] font-bold" style={{ background: '#6366f1', color: '#fff' }}>Ev</div>
                        <span className="text-[9px] font-semibold text-ink">Eduvance</span>
                      </div>
                      {['Dashboard', 'Syllabus', 'Planner', 'Quiz', 'Analytics'].map((item, i) => (
                        <div key={item} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[8px] text-ink-2" style={{
                          background: i === 0 ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)') : 'transparent',
                          color: i === 0 ? '#6366f1' : undefined,
                        }}>
                          <span>{['📊', '📚', '🗓', '🎯', '📈'][i]}</span>
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Main content area */}
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      {/* Top bar */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
                          <span className="text-[9px] font-medium text-ink">Dashboard</span>
                        </div>
                        <div className="text-[8px] text-ink-3">3h / day</div>
                      </div>

                      {/* Metric cards */}
                      <div className="mb-3 grid grid-cols-3 gap-2">
                        {[
                          { label: 'Exam in', value: '12 days', color: '#ef4444' },
                          { label: 'Progress', value: '68%', color: '#10b981' },
                          { label: 'Streak', value: '🔥 5', color: '#f97316' },
                        ].map((m) => (
                          <div key={m.label} className="rounded-lg p-2" style={{
                            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                          }}>
                            <div className="text-[7px] text-ink-3">{m.label}</div>
                            <div className="mt-0.5 text-[11px] font-bold" style={{ color: m.color }}>{m.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Priority list */}
                      <div className="flex-1 rounded-lg p-2" style={{
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      }}>
                        <div className="mb-1.5 text-[8px] font-semibold uppercase tracking-wider text-accent-2">Today's Priority</div>
                        {[
                          { topic: 'DBMS — Normalization', time: '45 min', priority: 'HIGH', color: '#ef4444' },
                          { topic: 'CN — Routing', time: '30 min', priority: 'MED', color: '#f97316' },
                          { topic: 'Java — Collections', time: '25 min', priority: 'LOW', color: '#10b981' },
                        ].map((t) => (
                          <div key={t.topic} className="mb-1 flex items-center justify-between rounded-md px-2 py-1" style={{
                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          }}>
                            <span className="text-[8px] text-ink">{t.topic}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[7px] text-ink-3">{t.time}</span>
                              <span className="rounded px-1 py-0.5 text-[6px] font-bold" style={{
                                background: `${t.color}20`, color: t.color,
                              }}>{t.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Octo mascot overlay — bottom right */}
                  <motion.div
                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="relative">
                      <img src="/mascot/octo-main.png" alt="Octo" className="h-16 w-16 sm:h-24 sm:w-24" style={{ filter: 'drop-shadow(0 4px 12px rgba(109,76,216,0.4))' }} />
                      {/* Speech bubble */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="absolute -left-32 bottom-2 w-28 rounded-xl px-3 py-2 text-[9px] leading-tight sm:-left-40 sm:bottom-4 sm:w-36 sm:text-[11px]"
                        style={{
                          background: isDark ? 'rgba(17,22,49,0.9)' : 'rgba(255,255,255,0.95)',
                          border: `1px solid ${isDark ? 'rgba(148,163,184,0.12)' : 'rgba(0,0,0,0.08)'}`,
                          color: isDark ? '#e2e8f0' : '#1e293b',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        }}
                      >
                        <span className="font-medium">Octo:</span> Let me show you how I plan your studies! 🐙
                        {/* Triangle pointer */}
                        <div className="absolute -right-1.5 bottom-3 h-0 w-0" style={{
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                          borderLeft: `6px solid ${isDark ? 'rgba(17,22,49,0.9)' : 'rgba(255,255,255,0.95)'}`,
                        }} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Play button overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full sm:h-20 sm:w-20"
                      style={{
                        background: 'rgba(99,102,241,0.85)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
                      }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg className="ml-1 h-7 w-7 text-white sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </motion.div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16" style={{
                    background: isDark
                      ? 'linear-gradient(transparent, rgba(6,9,24,0.4))'
                      : 'linear-gradient(transparent, rgba(244,242,238,0.3))',
                  }} />
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <footer className="relative border-t py-10" style={{ borderColor: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.04)' }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ background: '#6366f1', color: '#fff' }}>Ev</div>
                  <span className="font-serif text-sm font-semibold text-ink">Eduvance</span>
                </div>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-3">
                  Adaptive examination preparation powered by intelligent analysis and personalized study planning.
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-12">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-3">Product</p>
                  <div className="flex flex-col gap-1.5 text-xs text-ink-2">
                    <span className="cursor-pointer hover:text-accent transition-colors">Features</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Pricing</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Changelog</span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-3">Company</p>
                  <div className="flex flex-col gap-1.5 text-xs text-ink-2">
                    <span className="cursor-pointer hover:text-accent transition-colors">About</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Blog</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Contact</span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-3">Legal</p>
                  <div className="flex flex-col gap-1.5 text-xs text-ink-2">
                    <span className="cursor-pointer hover:text-accent transition-colors">Privacy</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Terms</span>
                    <span className="cursor-pointer hover:text-accent transition-colors">Cookie Policy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t pt-6 sm:flex-row" style={{ borderColor: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)' }}>
              <p className="text-[11px] text-ink-3">
                © 2026 Eduvance. All rights reserved. Built with 🧠 for students who refuse to guess.
              </p>
              <p className="text-[11px] text-ink-3">
                🐙 Octo says: "Study smart, not hard!"
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
