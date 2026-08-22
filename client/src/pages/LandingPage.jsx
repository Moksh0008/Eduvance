import { motion } from 'framer-motion'
import { MarketingNav } from '../components/layout/MarketingNav'
import { StartPreparingButton } from '../components/auth/StartPreparingButton'
import { useTheme } from '../context/ThemeContext'

const features = [
  { emoji: '⚡', text: 'Priority engine' },
  { emoji: '🔄', text: 'Auto-replan' },
  { emoji: '📊', text: 'Quiz analytics' },
  { emoji: '🗓', text: 'Smart planner' },
  { emoji: '🎯', text: 'Focus sessions' },
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
          {/* ── HERO ── */}
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
          </section>        </main>

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
