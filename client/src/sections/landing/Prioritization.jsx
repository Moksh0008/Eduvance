import { Reveal } from './Reveal'

export function Prioritization() {
  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Intelligent prioritization
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink">Priority is a score, not a feeling.</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            Eduvance ranks topics using exam proximity, marks weightage, paper frequency, difficulty, and current
            mastery. The student sees the number — and the reasons — before they open a book.
          </p>
        </Reveal>
        <Reveal>
          <div className="card bg-accent/[0.06] border-accent/20 p-6">
            <p className="text-xs uppercase tracking-wider text-ink-3">Now</p>
            <p className="mt-2 font-serif text-3xl text-ink">DBMS → Normalization</p>
            <p className="mt-4 tabular text-5xl font-semibold gradient-text">94</p>
            <p className="text-sm text-ink-3">Priority / 100</p>
            <ul className="mt-6 space-y-1.5 text-sm text-ink-2">
              <li>Weightage 20%</li>
              <li>Mastery 35%</li>
              <li>Appeared 4/4 papers</li>
              <li>Exam in 4 days</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
