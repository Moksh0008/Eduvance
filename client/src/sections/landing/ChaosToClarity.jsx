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
    <section id="clarity" className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">From chaos to clarity</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">
            Give Eduvance your academic constraints. We&apos;ll figure out what deserves your time.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Chaotic inputs</p>
            <ul className="mt-3 space-y-2">
              {inputs.map((x) => (
                <li key={x} className="border-t border-line py-2 font-medium">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="text-center">
            <p className="text-xs text-ink-3">↓</p>
            <p className="mt-2 inline-block border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-canvas">
              Eduvance
            </p>
            <p className="mt-2 text-xs text-ink-3">↓</p>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Optimized strategy</p>
            <ul className="mt-3 space-y-2">
              {outputs.map((x) => (
                <li key={x} className="border-t border-line py-2 font-medium">
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
