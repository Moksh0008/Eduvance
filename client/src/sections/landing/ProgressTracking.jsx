import { Reveal } from './Reveal'

export function ProgressTracking() {
  const rows = [
    { k: 'Overall preparation', v: '72%' },
    { k: 'Hours this week', v: '18.5 / 24' },
    { k: 'Weak high-weight topics', v: '4' },
    { k: 'Predicted DBMS readiness', v: '84% by exam' },
  ]
  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Progress tracking</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">Readiness is the metric. Not streaks.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r) => (
            <Reveal key={r.k} className="border-t border-line pt-4">
              <p className="text-xs text-ink-3">{r.k}</p>
              <p className="mt-2 tabular text-2xl font-semibold">{r.v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
