import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { FileDrop } from '../components/ui/FileDrop'
import { StageList } from '../components/ui/StageList'
import { getPapers } from '../services/catalog'
import { runStages } from '../services/simulate'

const importanceTone = {
  'VERY HIGH': 'high',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export function QuestionPapersPage() {
  const { papers, paperInsights } = getPapers()
  const [extra, setExtra] = useState(null)
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  async function onFile(file) {
    setDone(false)
    await runStages(['Reading paper…', 'Counting topic frequency…', 'Updating importance…'], (i) => setStage(i), 600)
    setDone(true)
    setExtra({ file: file.name, pages: '—', status: 'Queued (simulated)' })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Question papers"
        title="Frequency is a signal. Treat it as one."
        description="Upload is simulated. The table below is sample analysis so the product story is visible without a parser."
      />

      <FileDrop label="Upload previous paper" onFile={onFile} />
      {extra || done ? (
        <StageList
          stages={['Reading paper…', 'Counting topic frequency…', 'Updating importance…']}
          current={stage}
          complete={done}
        />
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Uploaded papers</h2>
        <ul className="mt-3">
          {(extra ? [extra, ...papers] : papers).map((p) => (
            <li key={p.id || p.file} className="flex items-center justify-between border-t border-line py-3 text-sm">
              <span className="font-medium">{p.file}</span>
              <span className="text-ink-3">
                {p.pages} pages · {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Topic importance (DBMS sample)</h2>
        <div className="mt-2 hidden grid-cols-12 border-b border-line pb-2 text-[10px] uppercase tracking-wider text-ink-3 sm:grid">
          <span className="col-span-4">Topic</span>
          <span className="col-span-3">Appeared</span>
          <span className="col-span-2">Avg marks</span>
          <span className="col-span-3">Importance</span>
        </div>
        {paperInsights.map((row) => (
          <article key={row.topic} className="grid gap-1 border-t border-line py-4 sm:grid-cols-12 sm:items-center">
            <p className="font-medium sm:col-span-4">{row.topic}</p>
            <p className="text-sm text-ink-2 sm:col-span-3">{row.appeared}</p>
            <p className="tabular text-sm sm:col-span-2">{row.avgMarks}</p>
            <div className="sm:col-span-3">
              <Badge tone={importanceTone[row.importance]}>{row.importance}</Badge>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-10">
        <EmptyState
          title="Parser not connected"
          body="When the backend is added, PDFs will extract marks and recurrence automatically. Until then, this table is realistic sample analysis."
        />
      </div>
    </div>
  )
}
