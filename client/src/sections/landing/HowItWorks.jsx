import { Reveal } from './Reveal'

const stages = [
  { n: '01', t: 'Ingest constraints', d: 'Exam dates, units, weightage, difficulty, available hours.' },
  { n: '02', t: 'Score every topic', d: 'Priority is computed from mastery, marks, papers, and deadline pressure.' },
  { n: '03', t: 'Allocate the day', d: 'Minutes go to the highest-return work — not the most comfortable chapter.' },
  { n: '04', t: 'Replan on evidence', d: 'A quiz, a skipped block, or a timetable change rebalances the calendar.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">How Eduvance works</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">A decision loop, not a content library.</h2>
        </Reveal>
        <div className="mt-12 grid gap-0 md:grid-cols-2">
          {stages.map((s) => (
            <Reveal key={s.n} className="border-t border-line py-8 md:odd:pr-10 md:even:border-l md:even:pl-10">
              <p className="tabular text-xs text-accent-2 font-semibold">{s.n}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
