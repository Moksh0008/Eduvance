import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { TopicCard } from '../components/domain/TopicCard'
import { DemoBanner } from '../components/domain/ModeBanners'
import { getUnits } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'
import { daysUntil } from '../utils/format'

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
                className={`shrink-0 border-b-2 px-3 py-2 text-sm ${
                  active === s.id ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-3 hover:text-ink'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-2">
            {current?.fullName || current?.name} · exam in {current?.examDate ? daysUntil(current.examDate) : '—'} days
            {current?.syllabusFile ? ` · file: ${current.syllabusFile.name}` : ''}
          </p>

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
                        <li key={topic.id} className="border-t border-line py-2 text-sm">
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
