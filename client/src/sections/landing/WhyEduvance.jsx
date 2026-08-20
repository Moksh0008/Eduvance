import { Reveal } from './Reveal'

const reasons = [
  { t: 'Decision layer', d: 'What, when, and how long — computed, then explained.' },
  { t: 'Constraint-aware', d: 'Deadlines, hours, and paper patterns are first-class inputs.' },
  { t: 'Adaptive by design', d: 'Every assessment is a replan event, not a disconnected score.' },
  { t: 'Not a chatbot', d: 'Language explains numbers. It does not invent the schedule.' },
]

export function WhyEduvance() {
  return (
    <section id="why" className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Why Eduvance</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">An academic optimization platform.</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {reasons.map((r) => (
            <Reveal key={r.t}>
              <h3 className="text-lg font-semibold">{r.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{r.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
