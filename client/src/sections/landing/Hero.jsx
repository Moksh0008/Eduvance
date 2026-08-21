import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { StartPreparingButton } from '../../components/auth/StartPreparingButton'
import { fadeUp, stagger } from '../../animations/variants'

const steps = [
  { name: 'Syllabus', icon: '📚' },
  { name: 'Analyze', icon: '🔍' },
  { name: 'Prioritize', icon: '⚡' },
  { name: 'Plan', icon: '🗓' },
  { name: 'Track', icon: '📊' },
  { name: 'Adapt', icon: '🔄' },
]

function OrbitalVisualization() {
  return (
    <div className="relative flex h-[320px] w-[320px] items-center justify-center">
      {/* Central core */}
      <motion.div
        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 border border-accent/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-xl" />
        <span className="relative text-2xl font-bold text-accent-2">Ev</span>
      </motion.div>

      {/* Orbiting nodes */}
      {steps.map((step, i) => {
        const angle = (i / steps.length) * 360
        const radius = 130
        return (
          <motion.div
            key={step.name}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: '50%',
              top: '50%',
            }}
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
            <div className="flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-surface border border-line-2 text-sm shadow-lg">
              {step.icon}
            </div>
            <span className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-ink-3">
              {step.name}
            </span>
          </motion.div>
        )
      })}

      {/* Connection lines (decorative rings) */}
      <div className="absolute h-[260px] w-[260px] rounded-full border border-line/50" />
      <div className="absolute h-[200px] w-[200px] rounded-full border border-line/30" />
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
            Your preparation.
            <br />
            <span className="gradient-text">Adapted intelligently.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg"
          >
            Eduvance analyzes your syllabus, exam constraints, progress, and performance to continuously
            optimize what you should study, when you should study it, and how much time you should spend.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
            <Button as="a" href="#clarity" variant="secondary" size="lg">
              Explore Eduvance
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-sm text-ink-3">
            Turn your syllabus into a strategy.
          </motion.p>
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
