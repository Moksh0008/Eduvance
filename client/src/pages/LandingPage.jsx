import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketingNav } from '../components/layout/MarketingNav'
import { StudyMascot } from '../components/ui/StudyMascot'
import { StartPreparingButton } from '../components/auth/StartPreparingButton'
import { Button } from '../components/ui/Button'
import { CinematicScroll } from '../components/domain/CinematicScroll'
import { Link } from 'react-router-dom'

/* ═══ SLIDESHOW DATA ═══ */
const slides = [
  { emoji: '📚', title: 'Add your syllabus', desc: 'Enter subjects, exams, and topics.', color: 'var(--color-accent)' },
  { emoji: '🧠', title: 'Eduvance analyzes', desc: 'Priority scores computed from your data.', color: 'var(--color-accent-2)' },
  { emoji: '🗓', title: 'Get your plan', desc: 'What, when, and how long — decided for you.', color: 'var(--color-low)' },
  { emoji: '🎯', title: 'Quiz & adapt', desc: 'Test yourself. Eduvance replans automatically.', color: 'var(--color-success)' },
]

const features = [
  { emoji: '⚡', text: 'Priority engine' },
  { emoji: '🔄', text: 'Auto-replan' },
  { emoji: '📊', text: 'Quiz analytics' },
  { emoji: '🗓', text: 'Smart planner' },
  { emoji: '🎯', text: 'Focus sessions' },
]

/* ═══ SLIDESHOW COMPONENT ═══ */
function SlideShow() {
  const [active, setActive] = useState(0)
  const advance = useCallback(() => setActive((p) => (p + 1) % slides.length), [])

  useEffect(() => {
    const timer = setInterval(advance, 3000)
    return () => clearInterval(timer)
  }, [advance])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative h-[200px] flex items-center justify-center overflow-hidden rounded-2xl"
           style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center gap-4 px-6"
          >
            <motion.span className="text-6xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >{slides[active].emoji}</motion.span>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-ink">{slides[active].title}</h3>
              <p className="mt-1 text-sm text-ink-2">{slides[active].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'var(--color-line-2)' }}>
          <motion.div className="h-full rounded-full" style={{ background: slides[active].color }}
            key={active} initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }} />
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: i === active ? 20 : 8, background: i === active ? 'var(--color-accent)' : 'var(--color-surface-3)' }} />
        ))}
      </div>
    </div>
  )
}

/* ═══ MAIN LANDING ═══ */
export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      {/* Cinematic scroll as FIXED background — plays as you scroll the page */}
      <CinematicScroll />

      {/* All content scrolls OVER the cinematic background */}
      <div className="relative" style={{ zIndex: 1 }}>
        <MarketingNav />

        <main>
          {/* ── HERO ── */}
          <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-accent/[0.05] blur-[150px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} className="relative z-10 flex flex-col items-center">

              <StudyMascot context="welcome" />

              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8 max-w-2xl font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
                Stop guessing<br /><span className="gradient-text">what to study.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base">
                Eduvance decides what, when, and how long — then replans when your performance changes.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
                <Button as={Link} to="/login?next=/dashboard" variant="secondary" size="lg">Open dashboard</Button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-2">
                {features.map((f) => (
                  <motion.span key={f.text} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-2"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
                    <span>{f.emoji}</span>{f.text}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ── SPACER: gives room for the cinematic animation to play ── */}
          <div style={{ height: '80vh' }} />

          {/* ── SEE IT IN ACTION ── */}
          <section className="relative px-4 py-20 sm:px-6" style={{ background: 'linear-gradient(180deg, transparent 0%, var(--color-canvas) 15%, var(--color-canvas) 85%, transparent 100%)' }}>
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} className="flex-1 text-center lg:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">See it in action</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">From syllabus to strategy.</h2>
                <p className="mt-3 max-w-md text-sm text-ink-2">
                  Eduvance analyzes your constraints, builds a plan, and adapts when your quiz results change the picture.
                </p>
                <div className="mt-6 flex justify-center gap-6 lg:justify-start">
                  {[{ emoji: '🎯', label: 'Priority scoring' }, { emoji: '🔄', label: 'Auto-replan' }, { emoji: '📊', label: 'Quiz analytics' }].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-xs text-ink-3">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} className="flex-1">
                <SlideShow />
              </motion.div>
            </div>
          </section>

          {/* ── FEATURE GRID ── */}
          <section className="px-4 py-20 sm:px-6" style={{ background: 'linear-gradient(180deg, transparent 0%, var(--color-canvas) 15%, var(--color-canvas) 85%, transparent 100%)' }}>
            <div className="mx-auto max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">What you get</p>
                <h2 className="mt-3 font-serif text-3xl text-ink">Everything you need. Nothing you don&apos;t.</h2>
              </motion.div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  { emoji: '📚', title: 'Syllabus', desc: 'Enter once, optimize forever' },
                  { emoji: '🗓', title: 'Planner', desc: 'Dynamic study timetable' },
                  { emoji: '⚡', title: 'Priorities', desc: 'Computed, not guessed' },
                  { emoji: '🎯', title: 'Quiz', desc: 'Test what matters' },
                  { emoji: '📊', title: 'Analytics', desc: 'See your patterns' },
                  { emoji: '🔄', title: 'Adaptive', desc: 'Replans automatically' },
                  { emoji: '📈', title: 'Progress', desc: 'Track readiness' },
                  { emoji: '🧠', title: 'Insights', desc: 'Know your weak spots' },
                ].map((f, i) => (
                  <motion.div key={f.title}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
                    <motion.span className="text-3xl"
                      whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}>{f.emoji}</motion.span>
                    <h3 className="text-sm font-semibold text-ink">{f.title}</h3>
                    <p className="text-xs text-ink-3">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FINAL CTA ── */}
          <section className="relative px-4 py-20 text-center sm:px-6" style={{ background: 'linear-gradient(180deg, transparent 0%, var(--color-canvas) 15%, var(--color-canvas) 85%, transparent 100%)' }}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-accent/[0.04] blur-[120px]" />
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="relative">
              <span className="text-5xl">🎓</span>
              <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">Ready to stop guessing?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-2">Build your preparation strategy in minutes.</p>
              <div className="mt-8 flex justify-center gap-3">
                <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
                <Button as={Link} to="/login?next=/dashboard" variant="secondary" size="lg">Open dashboard</Button>
              </div>
            </motion.div>
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
