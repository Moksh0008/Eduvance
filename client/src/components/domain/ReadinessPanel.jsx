import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { ProgressRing } from '../ui/ProgressRing'

export function ReadinessPanel({ items }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Preparation readiness</h2>
      <p className="mt-1 text-xs text-ink-3">Not a predicted exam score — a composite of coverage, mastery, practice, and revision.</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.subjectId} className="border-t border-line pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink">{item.name}</h3>
                <Badge tone={item.status === 'on-track' ? 'low' : 'high'} className="mt-2">
                  {item.statusLabel}
                </Badge>
              </div>
              <ProgressRing value={item.overall} size={72} stroke={6} />
            </div>
            <div className="mt-4 space-y-3">
              <ProgressBar value={item.coverage} label="Coverage" />
              <ProgressBar value={item.mastery} label="Mastery" />
              <ProgressBar value={item.practice} label="Practice" />
              <ProgressBar value={item.revision} label="Revision" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-3">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
