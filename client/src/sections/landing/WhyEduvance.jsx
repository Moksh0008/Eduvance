import { Reveal } from './Reveal'

const columns = [
  {
    label: 'Engine',
    features: [
      {
        t: 'Decision layer',
        d: 'What, when, and how long — computed, then explained.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 017 7c0 2.5-1.5 4.5-3 6l-1 4H9l-1-4c-1.5-1.5-3-3.5-3-6a7 7 0 017-7z" />
            <line x1="9" y1="21" x2="15" y2="21" />
          </svg>
        ),
        color: 'var(--color-accent)',
      },
      {
        t: 'Constraint-aware',
        d: 'Deadlines, hours, and paper patterns are first-class inputs.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
        color: 'var(--color-low)',
      },
    ],
  },
  {
    label: 'Intelligence',
    features: [
      {
        t: 'Adaptive by design',
        d: 'Every assessment is a replan event, not a disconnected score.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        ),
        color: 'var(--color-success)',
      },
      {
        t: 'Not a chatbot',
        d: 'Language explains numbers. It does not invent the schedule.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
        color: 'var(--color-accent-2)',
      },
    ],
  },
]

export function WhyEduvance() {
  return (
    <section id="why" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">Why Eduvance</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">An academic optimization platform.</h2>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {columns.map((col) => (
            <Reveal key={col.label}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3 mb-5">{col.label}</p>
                <div className="space-y-4">
                  {col.features.map((f) => (
                    <div key={f.t} className="group flex gap-4 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                         style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                           style={{ background: `${f.color}12`, color: f.color }}>
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{f.t}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
