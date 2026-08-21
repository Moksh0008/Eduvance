export function AdaptiveInsight({ title = 'Adaptive insight', children }) {
  return (
    <section className="rounded-lg border-l-2 border-l-accent bg-accent/[0.04] pl-4 pr-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-2">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-ink-2">{children}</div>
    </section>
  )
}
