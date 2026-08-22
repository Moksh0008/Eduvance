import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const problems = [
  { emoji: '📚', title: 'Massive syllabus', desc: 'Hundreds of topics across multiple subjects. Where do you even start?', stat: '200+ topics' },
  { emoji: '⏰', title: 'Running out of time', desc: 'Exam approaches fast. Your plan keeps changing. Panic sets in.', stat: '60 days left' },
  { emoji: '🎯', title: 'Unclear focus', desc: 'You study what you like, not what you need. Weak topics stay weak.', stat: '40% waste' },
  { emoji: '😰', title: 'No feedback loop', desc: 'You take quizzes but nothing changes. The plan stays the same.', stat: '0 adaptation' },
]

export function ProblemPage() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <div className="fixed inset-0 z-0">
        <img src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'} alt="" className="h-full w-full object-cover" style={{ opacity: 0.2 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-high">The problem</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Too much to study. Too little time.</h1>
          <p className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base">
            Every student faces the same challenge: an overwhelming syllabus, a ticking clock, and no clear strategy.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {problems.map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl p-6"
              style={{ background: isDark ? 'rgba(10,14,40,0.5)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <span className="text-[10px] font-bold text-high">{item.stat}</span>
                </div>
              </div>
              <p className="text-xs text-ink-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: isDark ? 'rgba(10,14,40,0.5)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
          <span className="text-4xl">💡</span>
          <h2 className="mt-3 font-serif text-2xl text-ink">What if your preparation could think?</h2>
          <p className="mt-2 text-sm text-ink-2">That&apos;s exactly what Eduvance does.</p>
          <div className="mt-6">
            <Button as={Link} to="/the-loop" variant="secondary">See how →</Button>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <Button as={Link} to="/" variant="secondary">← Back to home</Button>
        </div>
      </div>
    </div>
  )
}
