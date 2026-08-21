export function AdaptiveInsight({ title = 'Adaptive insight', children }) {
  return (
    <section className="border-l-2 border-l-accent pl-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-ink-2">{children}</div>
    </section>
  )
}
