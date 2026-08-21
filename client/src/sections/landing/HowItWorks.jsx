import { Reveal } from './Reveal'

const stages = [
  {
    n: '01',
    t: 'Ingest constraints',
    d: 'Exam dates, units, weightage, difficulty, available hours — everything Eduvance needs to reason about your preparation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    n: '02',
    t: 'Score every topic',
    d: 'Priority is computed from mastery, marks, papers, and deadline pressure. Not gut feeling.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    n: '03',
    t: 'Allocate the day',
    d: 'Minutes go to the highest-return work — not the most comfortable chapter.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    n: '04',
    t: 'Replan on evidence',
    d: 'A quiz, a skipped block, or a timetable change rebalances the calendar automatically.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">How Eduvance works</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">A decision loop, not a content library.</h2>
          <p className="mt-3 max-w-lg text-sm text-ink-2">
            Eduvance does not hand you a static timetable. It computes a strategy, tests it against your performance, and rebuilds it when the data changes.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                   style={{
                     background: 'var(--color-surface)',
                     border: '1px solid var(--color-line-2)',
                   }}>
                {/* Step number */}
                <div className="flex items-center justify-between">
                  <span className="tabular text-xs font-semibold text-accent-2">{s.n}</span>
                  <span className="text-ink-3 transition-colors duration-300 group-hover:text-accent-2">{s.icon}</span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-ink">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.d}</p>

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                     style={{ boxShadow: '0 0 40px var(--color-accent-glow)' }} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Visual connection line */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3">
            {stages.map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
                {i < stages.length - 1 && (
                  <div className="h-px w-8" style={{ background: 'var(--color-line-2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
