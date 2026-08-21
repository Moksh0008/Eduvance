import { Reveal } from './Reveal'

export function Comparison() {
  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Not a static timetable</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">The plan is allowed to change. That is the product.</h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Traditional planner</p>
            <ol className="mt-4 space-y-2 text-sm text-ink-2">
              <li>Student creates a timetable</li>
              <li>Student follows the timetable</li>
              <li>Performance changes</li>
              <li>Timetable becomes outdated</li>
            </ol>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-ink-3">Eduvance</p>
            <ol className="mt-4 space-y-2 text-sm text-ink">
              <li>Student provides constraints</li>
              <li>Eduvance analyzes workload</li>
              <li>Strategy + quizzes + schedule</li>
              <li>Performance is evidence</li>
              <li>Weakness is detected</li>
              <li>Priorities recalculate</li>
              <li>Remaining preparation is replanned</li>
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
