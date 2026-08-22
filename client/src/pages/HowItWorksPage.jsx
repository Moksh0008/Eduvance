import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const steps = [
  { step: '01', emoji: '📚', title: 'Enter your syllabus', desc: 'Add your subjects, exams, topics, and dates. Eduvance understands your constraints.', detail: 'Subjects · Topics · Exam dates · Daily hours' },
  { step: '02', emoji: '🧠', title: 'Eduvance analyzes', desc: 'The priority engine computes scores for every topic based on exam weight, difficulty, and your data.', detail: 'Priority scores · Difficulty ratings · Dependencies' },
  { step: '03', emoji: '🗓', title: 'Get your plan', desc: 'A personalized study timetable is generated — what to study, when, and for how long.', detail: 'Daily schedule · Time blocks · Topic allocation' },
  { step: '04', emoji: '🎯', title: 'Quiz & adapt', desc: 'Test yourself. Eduvance replans automatically based on your performance.', detail: 'Auto-replan · Weak topic focus · Progress tracking' },
]

export function HowItWorksPage() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <div className="fixed inset-0 z-0">
        <img src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'} alt="" className="h-full w-full object-cover" style={{ opacity: isDark ? 0.5 : 0.7 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">How it works</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">From syllabus to strategy.</h1>
          <p className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base">
            Four steps. Then the system takes over.
          </p>
        </motion.div>

        <div className="mt-12 space-y-6">
          {steps.map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative rounded-2xl p-6"
              style={{ background: isDark ? 'rgba(10,14,40,0.5)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ background: 'var(--color-accent-soft)' }}>
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-accent-2">Step {item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-2">{item.desc}</p>
                  <p className="mt-2 text-[11px] text-ink-3">{item.detail}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-11 -bottom-6 h-6 w-px" style={{ background: 'var(--color-line-2)' }} />
              )}
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
