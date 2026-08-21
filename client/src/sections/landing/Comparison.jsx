import { motion } from 'framer-motion'
import { Reveal } from './Reveal'

const traditional = [
  { text: 'Student creates a timetable', icon: '✏️' },
  { text: 'Student follows the timetable', icon: '📋' },
  { text: 'Performance changes', icon: '📉' },
  { text: 'Timetable becomes outdated', icon: '⏰' },
]

const eduvance = [
  { text: 'Student provides constraints', icon: '📝', accent: false },
  { text: 'Eduvance analyzes workload', icon: '🔍', accent: false },
  { text: 'Strategy + quizzes + schedule', icon: '🎯', accent: true },
  { text: 'Performance is evidence', icon: '📊', accent: false },
  { text: 'Weakness is detected', icon: '⚡', accent: true },
  { text: 'Priorities recalculate', icon: '🔄', accent: true },
  { text: 'Remaining preparation is replanned', icon: '🗓', accent: true },
]

function TimelineStep({ item, i, isEduvance }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.35 }}
    >
      {/* Timeline dot */}
      <div className="relative mt-1.5 flex flex-col items-center">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: item.accent ? 'var(--color-accent)' : 'var(--color-surface-3)',
            boxShadow: item.accent ? '0 0 8px var(--color-accent-glow)' : 'none',
          }}
        />
        {i < (isEduvance ? eduvance : traditional).length - 1 && (
          <div className="mt-1 h-6 w-px" style={{ background: 'var(--color-line-2)' }} />
        )}
      </div>
      <div className="flex items-center gap-2 pb-1">
        <span className="text-sm">{item.icon}</span>
        <span className={`text-sm ${item.accent ? 'font-medium text-ink' : 'text-ink-2'}`}>
          {item.text}
        </span>
      </div>
    </motion.div>
  )
}

export function Comparison() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Not a static timetable</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">The plan is allowed to change. That is the product.</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Traditional */}
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-2 w-2 rounded-full" style={{ background: 'var(--color-ink-3)' }} />
                <p className="text-xs uppercase tracking-wider text-ink-3">Traditional planner</p>
              </div>
              <div className="space-y-0">
                {traditional.map((item, i) => (
                  <TimelineStep key={item.text} item={item} i={i} isEduvance={false} />
                ))}
              </div>
              {/* Dead end indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-3">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                No adaptation loop
              </div>
            </div>
          </Reveal>

          {/* Eduvance */}
          <Reveal delay={0.1}>
            <div className="relative rounded-2xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid rgba(99,102,241,0.15)' }}>
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 h-[120px] w-[120px] rounded-full bg-accent/[0.06] blur-[60px]" />
              </div>

              <div className="relative flex items-center gap-2 mb-5">
                <div className="h-2 w-2 rounded-full" style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px var(--color-accent-glow)' }} />
                <p className="text-xs uppercase tracking-wider text-accent-2">Eduvance</p>
              </div>
              <div className="relative space-y-0">
                {eduvance.map((item, i) => (
                  <TimelineStep key={item.text} item={item} i={i} isEduvance={true} />
                ))}
              </div>
              {/* Loop indicator */}
              <div className="relative mt-3 flex items-center gap-2 text-xs text-accent-2">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                </svg>
                Continuous replanning loop
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
