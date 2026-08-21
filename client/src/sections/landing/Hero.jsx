import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { StartPreparingButton } from '../../components/auth/StartPreparingButton'
import { fadeUp, stagger } from '../../animations/variants'

const steps = ['Syllabus', 'Analyze', 'Prioritize', 'Plan', 'Track', 'Adapt']

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ddd6c8_1px,transparent_1px),linear-gradient(to_bottom,#ddd6c8_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
            Adaptive exam preparation
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-4 font-serif text-4xl leading-[1.08] text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            Don&apos;t Just Study.
            <br />
            Optimize Your Preparation.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
            Give Eduvance your academic constraints. We&apos;ll figure out what deserves your time — then keep
            replanning as performance, hours, and deadlines change.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
            <Button as="a" href="#clarity" variant="secondary" size="lg">
              See How It Works
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-sm text-ink-3">
            Turn your syllabus into a strategy.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Planning engine
          </p>
          <ol className="border-l border-ink">
            {steps.map((step, i) => (
              <li key={step} className="relative py-3 pl-6">
                <span className="absolute -left-[5px] top-5 h-2.5 w-2.5 rounded-full bg-ink" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-ink">{step}</span>
                  <span className="tabular text-xs text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                </div>
                {i < steps.length - 1 ? (
                  <p className="mt-1 text-xs text-ink-3">↓</p>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-ink-2">
                    Performance changes the next allocation. The loop never freezes.
                  </p>
                )}
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  )
}
