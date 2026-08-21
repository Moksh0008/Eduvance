import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { TopicCard } from '../components/domain/TopicCard'
import { DemoBanner } from '../components/domain/ModeBanners'
import { getUnits } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'
import { daysUntil } from '../utils/format'
import { cn } from '../utils/cn'

export function SyllabusPage() {
  const data = useAppData()
  const subjects = data.allSubjects || data.subjects
  const [active, setActive] = useState(subjects[0]?.id || '')
  const current = subjects.find((s) => s.id === active) || subjects[0]
  const demoUnits = useMemo(() => (data.isDemo && current ? getUnits(current.id) : []), [data.isDemo, current])

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Syllabus"
        title="Your academic content — not a canned CSE map."
        description={
          data.isDemo
            ? 'Demo mode shows a sample DBMS/Java/DSA/SE tree.'
            : 'Units and topics below are only what you entered. Uploaded PDFs stay as files until the analysis engine extracts a tree.'
        }
      />

      {!subjects.length ? (
        <p className="text-sm text-ink-2">No subjects in this workspace.</p>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Subjects">
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active === s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'shrink-0 rounded-lg px-4 py-2 text-sm transition-all',
                  active === s.id
                    ? 'bg-accent-soft font-medium text-accent-2'
                    : 'text-ink-3 hover:bg-surface-2 hover:text-ink',
                )}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm text-ink-2">
              {current?.fullName || current?.name} · exam in {current?.examDate ? daysUntil(current.examDate) : '—'} days
              {current?.syllabusFile ? ` · file: ${current.syllabusFile.name}` : ''}
            </p>
          </div>

          {data.isDemo ? (
            <div className="mt-8">
              {demoUnits.map((unit) => (
                <section key={unit.id} className="mb-10">
                  <h2 className="font-serif text-2xl text-ink">{unit.name}</h2>
                  {unit.topics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              {(current?.units || []).length === 0 ? (
                <p className="text-sm text-ink-2">
                  No units entered for this subject. If you uploaded a file, it is stored as uploaded — not parsed.
                </p>
              ) : (
                current.units.map((unit) => (
                  <section key={unit.id} className="mb-8">
                    <h2 className="font-serif text-2xl text-ink">{unit.name || 'Untitled unit'}</h2>
                    <ul className="mt-2">
                      {(unit.topics || []).map((topic) => (
                        <li key={topic.id} className="card mb-1 p-3 text-sm">
                          {topic.name || 'Untitled topic'}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
