export function ChartCard({ title, question, children }) {
  return (
    <section className="border-t border-line pt-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {question ? <p className="mt-1 text-xs text-ink-3">{question}</p> : null}
      <div className="mt-4 h-48 w-full min-w-0 overflow-hidden sm:h-56">{children}</div>
    </section>
  )
}
