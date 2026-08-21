import { Reveal } from './Reveal'

const inputs = ['Your timetable', 'Your syllabus', 'Your available time', 'Your performance']
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
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Chaotic inputs</p>
            <ul className="mt-3 space-y-2">
              {inputs.map((x) => (
                <li key={x} className="card py-3 px-4 font-medium text-ink-2">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="text-center">
            <p className="text-xs text-ink-3">↓</p>
            <p className="mt-2 inline-block rounded-xl bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              Eduvance
            </p>
            <p className="mt-2 text-xs text-ink-3">↓</p>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Optimized strategy</p>
            <ul className="mt-3 space-y-2">
              {outputs.map((x) => (
                <li key={x} className="card border-accent/10 bg-accent/[0.03] py-3 px-4 font-medium text-ink">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
