import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const features = [
  { emoji: '⚡', title: 'Priority engine', desc: 'Every topic gets a computed priority score. No guessing.', category: 'Engine' },
  { emoji: '🔄', title: 'Auto-replan', desc: 'Weak topics get more time. Strong topics get less. Automatically.', category: 'Engine' },
  { emoji: '📊', title: 'Quiz analytics', desc: 'See exactly where you stand per topic, per subject.', category: 'Intelligence' },
  { emoji: '🗓', title: 'Smart planner', desc: 'Dynamic timetable that adjusts to your performance.', category: 'Engine' },
  { emoji: '🎯', title: 'Focus sessions', desc: 'Timed, topic-specific study blocks with a built-in timer.', category: 'Experience' },
  { emoji: '📈', title: 'Progress tracking', desc: 'Visualize your readiness across all subjects.', category: 'Intelligence' },
  { emoji: '🧠', title: 'Insights', desc: 'Know your weak spots before the exam does.', category: 'Intelligence' },
  { emoji: '🔄', title: 'Adaptive learning', desc: 'The system learns from every quiz, every session.', category: 'Engine' },
]

export function WhyEduvancePage() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <div className="fixed inset-0 z-0">
        <img src={isDark ? '/dark-theme-bg.png' : '/light-theme-bg.png'} alt="" className="h-full w-full object-cover" style={{ opacity: isDark ? 0.18 : 0.2 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-success">Why Eduvance</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Not just a planner. A thinking system.</h1>
          <p className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base">
            Eduvance doesn&apos;t just show you what to study. It decides, adapts, and evolves with your performance.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-2xl p-5"
              style={{ background: isDark ? 'rgba(10,14,40,0.5)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{f.title}</h3>
                  <span className="text-[10px] font-medium text-ink-3">{f.category}</span>
                </div>
              </div>
              <p className="text-xs text-ink-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button as={Link} to="/" variant="secondary">← Back to home</Button>
        </div>
      </div>
    </div>
  )
}
