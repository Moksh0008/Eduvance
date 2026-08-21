import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { StartPreparingButton } from '../../components/auth/StartPreparingButton'
import { fadeUp, stagger } from '../../animations/variants'

const steps = [
  {
    name: 'Syllabus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    name: 'Analyze',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    name: 'Prioritize',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Plan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    name: 'Track',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    name: 'Adapt',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
  },
]

function OrbitalVisualization() {
  return (
    <div className="relative flex h-[340px] w-[340px] items-center justify-center">
      {/* Connection ring with animated dash */}
      <svg className="absolute h-[280px] w-[280px]" viewBox="0 0 280 280">
        <circle
          cx="140" cy="140" r="130"
          fill="none"
          stroke="var(--color-line-2)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="140" cy="140" r="95"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
        {/* Traveling particle */}
        <motion.circle
          cx="140" cy="140" r="3"
          fill="var(--color-accent)"
          opacity={0.6}
          animate={{
            cx: [
              140 + 130 * Math.cos(0),
              140 + 130 * Math.cos(Math.PI * 0.5),
              140 + 130 * Math.cos(Math.PI),
              140 + 130 * Math.cos(Math.PI * 1.5),
              140 + 130 * Math.cos(Math.PI * 2),
            ],
            cy: [
              140 + 130 * Math.sin(0),
              140 + 130 * Math.sin(Math.PI * 0.5),
              140 + 130 * Math.sin(Math.PI),
              140 + 130 * Math.sin(Math.PI * 1.5),
              140 + 130 * Math.sin(Math.PI * 2),
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Central core */}
      <motion.div
        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent-soft), rgba(99,102,241,0.15))',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 0 40px var(--color-accent-glow)',
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'var(--color-accent-soft)' }} />
        <span className="relative text-2xl font-bold gradient-text">Ev</span>
      </motion.div>

      {/* Orbiting nodes */}
      {steps.map((step, i) => {
        const angle = (i / steps.length) * 360
        const radius = 130
        return (
          <motion.div
            key={step.name}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [
                Math.cos(((angle - 90) * Math.PI) / 180) * radius,
                Math.cos(((angle - 90 + 360) * Math.PI) / 180) * radius,
              ],
              y: [
                Math.sin(((angle - 90) * Math.PI) / 180) * radius,
                Math.sin(((angle - 90 + 360) * Math.PI) / 180) * radius,
              ],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl text-accent-2 transition-all duration-300 hover:scale-110"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-line-2)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {step.icon}
            </div>
            <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-ink-3">
              {step.name}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-accent/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-low/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-2"
          >
            Adaptive exam preparation
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-4 font-serif text-4xl leading-[1.08] text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            Stop guessing
            <br />
            <span className="gradient-text">what to study.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg"
          >
            Eduvance analyzes your syllabus, exam constraints, progress, and performance to
            decide what deserves the next two hours — then replans when the data changes.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
            <Button as="a" href="#demo" variant="secondary" size="lg">
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <OrbitalVisualization />
        </motion.div>
      </div>
    </section>
  )
}
