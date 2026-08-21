import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './Reveal'

const steps = [
  {
    label: 'Add your syllabus',
    description: 'Enter subjects, topics, and exam dates.',
    visual: 'syllabus',
  },
  {
    label: 'Eduvance analyzes',
    description: 'Priority scores computed from mastery, weightage, and deadlines.',
    visual: 'analyze',
  },
  {
    label: 'Get your plan',
    description: 'What to study, when, and for how long — decided for you.',
    visual: 'plan',
  },
  {
    label: 'Study & quiz',
    description: 'Work through the plan. Take quizzes to measure understanding.',
    visual: 'quiz',
  },
  {
    label: 'Eduvance adapts',
    description: 'Weak topics resurface. Strong ones fade. The plan evolves.',
    visual: 'adapt',
  },
]

/* Mini UI mockups that visualize each step */
function StepVisual({ visual, isActive }) {
  const barColor = 'var(--color-accent)'
  const accentSoft = 'var(--color-accent-soft)'
  const surface = 'var(--color-surface)'
  const surface2 = 'var(--color-surface-2)'
  const ink = 'var(--color-ink)'
  const ink2 = 'var(--color-ink-2)'
  const ink3 = 'var(--color-ink-3)'
  const line2 = 'var(--color-line-2)'

  if (visual === 'syllabus') {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        {['DBMS', 'OS', 'CN', 'Maths'].map((s, i) => (
          <motion.div
            key={s}
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: surface, border: `1px solid ${line2}` }}
            initial={{ opacity: 0, x: -10 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
          >
            <div className="h-2 w-2 rounded-full" style={{ background: barColor }} />
            <span className="text-xs font-medium" style={{ color: ink }}>{s}</span>
            <span className="ml-auto text-[10px]" style={{ color: ink3 }}>3 units</span>
          </motion.div>
        ))}
      </div>
    )
  }

  if (visual === 'analyze') {
    const bars = [
      { name: 'DBMS Foundations', score: 54 },
      { name: 'OS Memory', score: 38 },
      { name: 'CN Routing', score: 72 },
    ]
    return (
      <div className="flex flex-col gap-3 w-full max-w-[220px]">
        {bars.map((b, i) => (
          <div key={b.name}>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: ink2 }}>
              <span>{b.name}</span>
              <span className="tabular">{b.score}</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: surface2 }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: barColor }}
                initial={{ width: 0 }}
                animate={isActive ? { width: `${b.score}%` } : { width: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (visual === 'plan') {
    const blocks = [
      { time: '9:00', subj: 'DBMS', dur: '45m', color: barColor },
      { time: '9:45', subj: 'OS', dur: '30m', color: '#22d3ee' },
      { time: '10:15', subj: 'Maths', dur: '40m', color: '#a78bfa' },
    ]
    return (
      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        {blocks.map((b, i) => (
          <motion.div
            key={b.time}
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: surface, border: `1px solid ${line2}` }}
            initial={{ opacity: 0, y: 8 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.35 }}
          >
            <span className="tabular text-[10px] w-10" style={{ color: ink3 }}>{b.time}</span>
            <div className="h-5 w-1 rounded-full" style={{ background: b.color }} />
            <span className="text-xs font-medium" style={{ color: ink }}>{b.subj}</span>
            <span className="ml-auto text-[10px]" style={{ color: ink3 }}>{b.dur}</span>
          </motion.div>
        ))}
      </div>
    )
  }

  if (visual === 'quiz') {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        <div className="rounded-lg px-3 py-2" style={{ background: surface, border: `1px solid ${line2}` }}>
          <p className="text-[10px] mb-2" style={{ color: ink3 }}>Question 3/10</p>
          <p className="text-xs font-medium" style={{ color: ink }}>What is normalization?</p>
        </div>
        {['Reducing redundancy', 'Adding indexes', 'Creating views', 'Encrypting data'].map((a, i) => (
          <motion.div
            key={a}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{
              background: i === 0 ? 'rgba(34,197,94,0.1)' : surface,
              border: `1px solid ${i === 0 ? 'rgba(34,197,94,0.3)' : line2}`,
            }}
            initial={{ opacity: 0, x: -6 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.25 }}
          >
            {i === 0 && <span className="text-[10px]">✓</span>}
            <span className="text-[11px]" style={{ color: i === 0 ? 'var(--color-success)' : ink2 }}>{a}</span>
          </motion.div>
        ))}
      </div>
    )
  }

  if (visual === 'adapt') {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        <div className="rounded-lg px-3 py-2" style={{ background: surface, border: `1px solid ${line2}` }}>
          <p className="text-[10px] mb-1" style={{ color: ink3 }}>Plan updated</p>
          <p className="text-[11px] font-medium" style={{ color: ink }}>OS Memory → priority increased</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: accentSoft }}>
          <motion.div
            className="h-2 w-2 rounded-full"
            style={{ background: barColor }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[11px] font-medium" style={{ color: 'var(--color-accent-2)' }}>Eduvance is replanning…</span>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: surface, border: `1px solid ${line2}` }}>
          <p className="text-[10px] mb-1" style={{ color: ink3 }}>Why this change?</p>
          <p className="text-[11px]" style={{ color: ink2 }}>Quiz score 40% on Memory mgmt. Deadline in 4 days.</p>
        </div>
      </div>
    )
  }

  return null
}

export function ProductDemo() {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length)
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleStep = (i) => {
    setActive(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length)
    }, 3500)
  }

  return (
    <section id="demo" className="relative py-24 overflow-hidden">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-accent/[0.03] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">
            See it in action
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
            From syllabus to strategy.<br />
            <span className="gradient-text">In five steps.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">
            Eduvance turns your academic constraints into a living, adaptive study plan.
            No templates. No generic schedules. Just decisions backed by your data.
          </p>
        </Reveal>

        {/* Step indicators */}
        <div className="mt-12 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <button
              key={s.label}
              onClick={() => handleStep(i)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300"
              style={{
                background: i === active ? 'var(--color-accent)' : 'var(--color-surface)',
                color: i === active ? '#fff' : 'var(--color-ink-2)',
                border: `1px solid ${i === active ? 'transparent' : 'var(--color-line-2)'}`,
                boxShadow: i === active ? '0 0 20px var(--color-accent-glow)' : 'none',
              }}
            >
              <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Active step visualization */}
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p className="tabular text-xs font-semibold text-accent-2">
                Step {String(active + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">
                {steps[active].label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {steps[active].description}
              </p>

              {/* Connection to real features */}
              <div className="mt-6 flex flex-wrap gap-2">
                {active === 0 && (
                  <>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Syllabus</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Exams</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Topics</span>
                  </>
                )}
                {active === 1 && (
                  <>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Priority engine</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Mastery scoring</span>
                  </>
                )}
                {active === 2 && (
                  <>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Planner</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Timetable</span>
                  </>
                )}
                {active === 3 && (
                  <>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Quiz</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Study session</span>
                  </>
                )}
                {active === 4 && (
                  <>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Adaptive loop</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[10px] text-ink-3" style={{ border: '1px solid var(--color-line-2)' }}>Replan</span>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visual mockup area */}
          <div className="relative flex items-center justify-center rounded-2xl p-8 min-h-[300px]"
               style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <StepVisual visual={steps[active].visual} isActive={true} />
              </motion.div>
            </AnimatePresence>

            {/* Subtle glow behind */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[120px] w-[200px] rounded-full bg-accent/[0.06] blur-[60px]" />
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => handleStep(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? '24px' : '6px',
                background: i === active ? 'var(--color-accent)' : 'var(--color-surface-3)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
