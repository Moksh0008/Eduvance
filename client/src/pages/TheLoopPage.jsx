import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const steps = [
  { icon: '📊', title: 'Analyze', desc: 'Eduvance examines your syllabus, exam date, and available study hours to understand your constraints.', color: '#6366f1' },
  { icon: '🎯', title: 'Prioritize', desc: 'Each topic gets a priority score based on exam weight, difficulty, your past performance, and dependencies.', color: '#f97316' },
  { icon: '🗓', title: 'Plan', desc: 'A personalized study timetable is built — what to study, when, and for how long.', color: '#06b6d4' },
  { icon: '📖', title: 'Study', desc: 'You follow the plan. Focus sessions keep you on track with timed, topic-specific study blocks.', color: '#22c55e' },
  { icon: '✅', title: 'Quiz', desc: 'After studying, take a quiz to test your understanding. Every answer feeds back into the system.', color: '#eab308' },
  { icon: '🔍', title: 'Evaluate', desc: 'Your quiz results are analyzed. Weak topics are identified. Strong topics are confirmed.', color: '#ec4899' },
  { icon: '🔄', title: 'Replan', desc: 'The plan automatically adjusts. Weak topics get more time. Strong topics get less. The loop continues.', color: '#8b5cf6' },
]

export function TheLoopPage() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <div className="fixed inset-0 z-0">
        <img src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'} alt="" className="h-full w-full object-cover" style={{ opacity: 0.2 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">The adaptive loop</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Your preparation adapts with you.</h1>
          <p className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base">
            Eduvance continuously analyzes your performance, prioritizes weak spots, and rebuilds your study plan — automatically.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          {steps.map((step, i) => (
            <motion.div key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 rounded-xl p-5"
              style={{ background: 'rgba(10,14,40,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                style={{ background: step.color + '20' }}>
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: step.color }}>0{i + 1}</span>
                  <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                </div>
                <p className="mt-1 text-xs text-ink-2">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-9 mt-12 h-4 w-px" style={{ background: 'var(--color-line-2)' }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Visual loop */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {steps.map((step, i) => (
            <span key={step.title} className="rounded-lg px-3 py-1.5 text-xs font-medium"
              style={{ background: step.color + '15', color: step.color, border: `1px solid ${step.color}30` }}>
              {step.icon} {step.title}
            </span>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button as={Link} to="/" variant="secondary">← Back to home</Button>
        </div>
      </div>
    </div>
  )
}
