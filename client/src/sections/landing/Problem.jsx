import { Reveal } from './Reveal'

const pains = [
  {
    title: 'Too much syllabus',
    body: 'Hundreds of topics. No signal for what actually moves the exam score.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    color: 'var(--color-high)',
  },
  {
    title: 'Static schedules',
    body: 'A timetable written on day one is already wrong after the first test.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'var(--color-med)',
  },
  {
    title: 'Equal time, unequal papers',
    body: 'Students spend hours on low-weight chapters while high-weight gaps stay open.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    color: 'var(--color-risk)',
  },
]

export function Problem() {
  return (
    <section id="problem" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">The problem</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">
            ChatGPT can tell you how to study. It will not decide what deserves the next two hours.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                   style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
                {/* Icon with colored background */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                     style={{ background: `${p.color}15`, color: p.color }}>
                  {p.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.body}</p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                     style={{ background: p.color }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
