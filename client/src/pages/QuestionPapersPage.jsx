import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { FileDrop } from '../components/ui/FileDrop'
import { StageList } from '../components/ui/StageList'
import { getPapers } from '../services/catalog'
import { runStages } from '../services/simulate'
import { DemoBanner } from '../components/domain/ModeBanners'
import { useAppData } from '../hooks/useAppData'

const importanceTone = {
  'VERY HIGH': 'high',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export function QuestionPapersPage() {
  const data = useAppData()
  const { papers, paperInsights } = getPapers()
  const [extra, setExtra] = useState(null)
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  async function onFile(file) {
    setDone(false)
    await runStages(['Storing file metadata…', 'Queued for analysis engine…', 'Waiting for extraction…'], (i) => setStage(i), 500)
    setDone(true)
    setExtra({ file: file.name, pages: '—', status: 'Uploaded' })
  }

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Question papers"
        title="Frequency is a signal. Treat it as one."
        description="Uploads are stored as files. Sample frequency tables are demo data, not the result of your PDF."
      />

      <FileDrop label="Upload previous paper" onFile={onFile} />
      {extra || done ? (
        <StageList
          stages={['Storing file metadata…', 'Queued for analysis engine…', 'Waiting for extraction…']}
          current={stage}
          complete={done}
        />
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Uploaded papers</h2>
        <ul className="mt-3">
          {(extra ? [extra, ...(data.isDemo ? papers : [])] : data.isDemo ? papers : extra ? [extra] : []).map((p) => (
            <li key={p.id || p.file} className="card mb-2 flex items-center justify-between p-4 text-sm">
              <span className="font-medium text-ink">{p.file}</span>
              <span className="text-ink-3">
                {p.pages} pages · {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {data.isDemo ? (
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
              <p className="font-medium text-ink sm:col-span-4">{row.topic}</p>
              <p className="text-sm text-ink-2 sm:col-span-3">{row.appeared}</p>
              <p className="tabular text-sm text-ink-2 sm:col-span-2">{row.avgMarks}</p>
              <div className="sm:col-span-3">
                <Badge tone={importanceTone[row.importance]}>{row.importance}</Badge>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <div className="mt-10">
        <EmptyState
          title="Parser not connected"
          body="Analysis will be performed by Eduvance's analysis engine. The DBMS frequency table is demo-only."
        />
      </div>
    </div>
  )
}
