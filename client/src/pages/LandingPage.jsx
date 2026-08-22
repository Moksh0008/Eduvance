import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketingNav } from '../components/layout/MarketingNav'
import { StartPreparingButton } from '../components/auth/StartPreparingButton'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'
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
           style={{ background: 'rgba(10,14,40,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
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
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      {/* Fixed background image — same for both dark and light */}
      <div className="fixed inset-0 z-0">
        <img
          src={isDark ? '/dark-theme-bg.png' : '/light-theme-bg.png'}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ opacity: 0.35 }}
        />
        {/* Gradient overlay to fade into content */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(6,9,24,0.3) 0%, rgba(6,9,24,0.7) 30%, rgba(6,9,24,0.9) 60%, var(--color-canvas) 100%)'
            : 'linear-gradient(180deg, rgba(244,242,238,0.2) 0%, rgba(244,242,238,0.6) 30%, rgba(244,242,238,0.85) 60%, var(--color-canvas) 100%)'
        }} />
      </div>

      {/* All content scrolls OVER the fixed background */}
      <div className="relative" style={{ zIndex: 1 }}>
        <MarketingNav />

        <main>
          {/* ── HERO ── */}
          <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16" id="hero">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} className="relative z-10 flex flex-col items-center">

              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-6 max-w-xl font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
                Stop guessing<br /><span className="gradient-text">what to study.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-3 max-w-md text-sm text-ink-2 sm:text-base">
                Eduvance decides what, when, and how long — then replans when your performance changes.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
                <Button as={Link} to="/login?next=/dashboard" variant="secondary" size="lg">Open dashboard</Button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-6 flex flex-wrap justify-center gap-2">
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

          {/* ── ABOUT (The loop) ── */}
          <section id="clarity" className="relative px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">The adaptive loop</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Your preparation adapts with you.</h2>
                <p className="mt-3 max-w-lg mx-auto text-sm text-ink-2">
                  Eduvance continuously analyzes your performance, prioritizes weak spots, and rebuilds your study plan — automatically.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {['📊 Analyze', '🎯 Prioritize', '🗓 Plan', '📖 Study', '✅ Quiz', '🔍 Evaluate', '🔄 Replan'].map((step, i) => (
                  <motion.div key={step}
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
                    style={{ background: 'rgba(10,14,40,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {step}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── PROBLEM ── */}
          <section id="problem" className="relative px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-high">The problem</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Too much to study. Too little time.</h2>
              </motion.div>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { emoji: '📚', title: 'Massive syllabus', desc: 'Hundreds of topics, unclear priorities' },
                  { emoji: '⏰', title: 'Running out of time', desc: 'Exam approaches, plan keeps changing' },
                  { emoji: '🎯', title: 'Unclear focus', desc: 'Don\'t know what to study right now' },
                ].map((item, i) => (
                  <motion.div key={item.title}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl p-6 text-center"
                    style={{ background: 'rgba(10,14,40,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-3xl">{item.emoji}</span>
                    <h3 className="mt-3 text-sm font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs text-ink-3">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section id="how" className="relative px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">How it works</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">From syllabus to strategy.</h2>
              </motion.div>
              <div className="mt-10 flex flex-col items-center gap-4">
                {[
                  { step: '01', emoji: '📚', title: 'Enter your syllabus', desc: 'Subjects, exams, topics, dates' },
                  { step: '02', emoji: '🧠', title: 'Eduvance analyzes', desc: 'Priority scores computed from your data' },
                  { step: '03', emoji: '🗓', title: 'Get your plan', desc: 'What, when, and how long — decided for you' },
                  { step: '04', emoji: '🎯', title: 'Quiz & adapt', desc: 'Test yourself. Eduvance replans automatically' },
                ].map((item, i) => (
                  <motion.div key={item.step}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 w-full max-w-lg rounded-xl px-5 py-4"
                    style={{ background: 'rgba(10,14,40,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-2xl font-bold text-accent-2 opacity-50">{item.step}</span>
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                      <p className="text-xs text-ink-3">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WHY EDUVANCE ── */}
          <section id="why" className="relative px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-success">Why Eduvance</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Not just a planner. A thinking system.</h2>
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
                    style={{ background: 'rgba(10,14,40,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
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

          {/* ── SEE IT IN ACTION ── */}
          <section className="relative px-4 py-16 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} className="flex-1 text-center lg:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">See it in action</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">The engine has a plan.</h2>
                <p className="mt-3 max-w-md text-sm text-ink-2">
                  Eduvance analyzes your constraints, builds a plan, and adapts when your quiz results change the picture.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} className="flex-1">
                <SlideShow />
              </motion.div>
            </div>
          </section>

          {/* ── FINAL CTA ── */}
          <section className="relative px-4 py-20 text-center sm:px-6">
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
