export function StatCard({ label, value, hint }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</p>
      <p className="mt-1 tabular text-2xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-3">{hint}</p> : null}
    </div>
  )
}
