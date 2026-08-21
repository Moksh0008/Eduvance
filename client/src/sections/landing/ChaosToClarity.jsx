import { motion } from 'framer-motion'
import { Reveal } from './Reveal'

const inputs = [
  { text: 'Your timetable', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )},
  { text: 'Your syllabus', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )},
  { text: 'Your available time', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )},
  { text: 'Your performance', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )},
]

const outputs = [
  'What to study',
  'When to study',
  'How long',
  'What to revise',
  "Where you're weak",
  'What to improve',
]

export function ChaosToClarity() {
  return (
    <section id="clarity" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">From chaos to clarity</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">
            Give Eduvance your academic constraints. We&apos;ll figure out what deserves your time.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Inputs */}
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-3 mb-3">Chaotic inputs</p>
            <ul className="space-y-2">
              {inputs.map((x, i) => (
                <motion.li
                  key={x.text}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-2"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <span className="text-ink-3">{x.icon}</span>
                  {x.text}
                </motion.li>
              ))}
            </ul>
          </Reveal>

          {/* Center flow */}
          <Reveal className="hidden lg:flex flex-col items-center gap-1">
            {/* Arrow down */}
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-ink-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            {/* Eduvance badge */}
            <div className="relative my-1">
              <div className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                   style={{ background: 'var(--color-accent)', boxShadow: '0 0 30px var(--color-accent-glow)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                </svg>
                Eduvance
              </div>
            </div>
            {/* Arrow down */}
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-ink-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </Reveal>

          {/* Outputs */}
          <Reveal delay={0.08}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-3 mb-3">Optimized strategy</p>
            <ul className="space-y-2">
              {outputs.map((x, i) => (
                <motion.li
                  key={x}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium"
                  style={{
                    background: 'var(--color-accent-soft)',
                    border: '1px solid rgba(99,102,241,0.1)',
                    color: 'var(--color-ink)',
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
                  {x}
                </motion.li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
