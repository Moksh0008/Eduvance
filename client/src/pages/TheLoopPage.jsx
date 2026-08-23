import { useState, useEffect } from 'react'
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

function useActiveStep() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % steps.length), 3000)
    return () => clearInterval(interval)
  }, [])
  return step
}

export function TheLoopPage() {
  const { isDark } = useTheme()
  const activeStep = useActiveStep()

  const size = 360
  const radius = 140
  const center = size / 2

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <div className="fixed inset-0 z-0">
        <img src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'} alt="" className="h-full w-full object-cover"
          style={{ opacity: isDark ? 0.5 : 0.85 }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">The adaptive loop</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Your preparation adapts with you.</h1>
          <p className="mt-4 max-w-lg text-sm text-ink-2 sm:text-base mx-auto">
            Eduvance continuously analyzes your performance, prioritizes weak spots, and rebuilds your study plan — automatically.
          </p>
        </motion.div>

        {/* Circular loop + descriptions side by side */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Circular visualization */}
          <div className="shrink-0 relative" style={{ width: size, height: size }}>
            {/* Center hub */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full z-10"
              style={{
                width: 100, height: 100,
                background: isDark
                  ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(6,9,24,0.8) 70%)'
                  : 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(244,242,238,0.8) 70%)',
                border: `1.5px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
                backdropFilter: 'blur(12px)',
              }}
              animate={{ boxShadow: [`0 0 20px ${steps[activeStep].color}15`, `0 0 40px ${steps[activeStep].color}25`, `0 0 20px ${steps[activeStep].color}15`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span className="text-2xl" key={activeStep}
                initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                {steps[activeStep].icon}
              </motion.span>
              <motion.span className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
                style={{ color: steps[activeStep].color }}
                key={`label-${activeStep}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                {steps[activeStep].title}
              </motion.span>
            </motion.div>

            {/* Orbit ring */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: radius * 2 + 30, height: radius * 2 + 30, border: `1px dashed ${isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)'}` }} />

            {/* Connecting arcs */}
            <svg className="absolute inset-0 pointer-events-none" width={size} height={size} aria-hidden="true">
              {steps.map((step, i) => {
                const a1 = (i / steps.length) * Math.PI * 2 - Math.PI / 2
                const a2 = ((i + 1) / steps.length) * Math.PI * 2 - Math.PI / 2
                const x1 = center + Math.cos(a1) * radius
                const y1 = center + Math.sin(a1) * radius
                const x2 = center + Math.cos(a2) * radius
                const y2 = center + Math.sin(a2) * radius
                const mx = (x1 + x2) / 2
                const my = (y1 + y2) / 2
                const cx = mx + (center - mx) * 0.2
                const cy = my + (center - my) * 0.2
                return (
                  <path key={`arc-${i}`} d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    fill="none" stroke={i === activeStep ? step.color : isDark ? 'rgba(148,163,184,0.08)' : 'rgba(26,29,46,0.06)'}
                    strokeWidth={i === activeStep ? 2.5 : 1} strokeLinecap="round" />
                )
              })}
            </svg>

            {/* Step nodes */}
            {steps.map((step, i) => {
              const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2
              const x = center + Math.cos(angle) * radius
              const y = center + Math.sin(angle) * radius
              const isActive = i === activeStep
              return (
                <motion.div key={step.title} className="absolute z-10 flex flex-col items-center"
                  style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}>
                  <motion.div className="flex items-center justify-center rounded-full transition-all duration-500"
                    style={{
                      width: isActive ? 48 : 40, height: isActive ? 48 : 40,
                      background: isActive ? `${step.color}20` : isDark ? 'rgba(17,22,49,0.6)' : 'rgba(255,255,255,0.7)',
                      border: `2px solid ${isActive ? step.color : isDark ? 'rgba(148,163,184,0.1)' : 'rgba(26,29,46,0.08)'}`,
                      boxShadow: isActive ? `0 0 24px ${step.color}30` : 'none',
                      backdropFilter: 'blur(8px)',
                    }}
                    animate={isActive ? { scale: [1, 1.15, 1], boxShadow: [`0 0 16px ${step.color}20`, `0 0 32px ${step.color}40`, `0 0 16px ${step.color}20`] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-lg">{step.icon}</span>
                  </motion.div>
                  <span className="mt-1 text-[10px] font-semibold text-center" style={{ color: isActive ? step.color : 'var(--color-ink-3)', maxWidth: 60, lineHeight: 1.2 }}>
                    {step.title}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* Description list */}
          <div className="flex-1 space-y-3">
            {steps.map((step, i) => (
              <motion.div key={step.title}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                style={{ background: i === activeStep ? `${step.color}10` : 'transparent' }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: i === activeStep ? `${step.color}20` : 'var(--color-accent-soft)', color: i === activeStep ? step.color : 'var(--color-ink-3)' }}>
                  {step.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold" style={{ color: step.color }}>0{i + 1}</span>
                    <p className="text-sm font-semibold text-ink">{step.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-2">{step.desc}</p>
                </div>
                {i === activeStep && (
                  <motion.div className="ml-auto h-1.5 w-1.5 rounded-full shrink-0 mt-1.5"
                    style={{ background: step.color }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-16 text-center">
          <Button as={Link} to="/" variant="secondary">← Back to home</Button>
        </div>
      </div>
    </div>
  )
}
