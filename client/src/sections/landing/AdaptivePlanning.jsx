import { Reveal } from './Reveal'

export function AdaptivePlanning() {
  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-2">Adaptive planning</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">
            When performance changes, the calendar changes — and it explains itself.
          </h2>
        </Reveal>
        <Reveal className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wider text-ink-3">Before</p>
            <p className="mt-3 text-2xl font-medium text-ink">Normalization · 90 min</p>
          </div>
          <div className="card border-accent/20 bg-accent/[0.04] p-6">
            <p className="text-xs uppercase tracking-wider text-accent-2">After quiz 42%</p>
            <p className="mt-3 text-2xl font-medium text-accent-2">Normalization · 2h 15m</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              Accuracy dropped below the target threshold and the DBMS paper is four days away. Collections lost 15
              minutes so the high-weight gap could close.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
