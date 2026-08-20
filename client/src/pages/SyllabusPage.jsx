import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { TopicCard } from '../components/domain/TopicCard'
import { getSubjects, getUnits } from '../services/catalog'
import { daysUntil } from '../utils/format'

export function SyllabusPage() {
  const subjects = getSubjects()
  const [active, setActive] = useState('dbms')
  const units = useMemo(() => getUnits(active), [active])
  const current = subjects.find((s) => s.id === active)

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="Every topic has a cost and a return."
        description="Difficulty, marks weightage, mastery, and priority sit on the same row so the next unit is obvious."
      />

      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Subjects">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm ${
              active === s.id ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-2">
        {current?.fullName} · exam in {current ? daysUntil(current.examDate) : '—'} days · readiness {current?.progress}%
      </p>

      <div className="mt-8">
        {units.map((unit) => (
          <section key={unit.id} className="mb-10">
            <h2 className="font-serif text-2xl text-ink">{unit.name}</h2>
            <div className="mt-2 hidden grid-cols-12 text-[10px] uppercase tracking-wider text-ink-3 sm:grid">
              <span className="col-span-3">Topic</span>
              <span className="col-span-1">Diff.</span>
              <span className="col-span-1">Marks</span>
              <span className="col-span-3">Mastery</span>
              <span className="col-span-1">Priority</span>
              <span className="col-span-1 text-right">Time</span>
            </div>
            {unit.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}